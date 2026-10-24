package com.safeguardjapan.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safeguardjapan.model.AlertInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.Instant;

@Component
public class JmaClient {

    private static final Logger log = LoggerFactory.getLogger(JmaClient.class);
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${jma.api.quake-url:https://www.jma.go.jp/bosai/quake/data/list.json}")
    private String jmaQuakeUrl;

    public JmaClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        // Configure 3-second connection and read timeout
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(3));
        requestFactory.setReadTimeout(Duration.ofSeconds(3));

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .defaultHeader("User-Agent", "SafeGuardJapan/1.0 (Disaster Preparedness)")
                .build();
    }

    /**
     * Retrieves latest JMA earthquake data with a 3-second timeout.
     */
    public AlertInfo fetchLatestEarthquake() {
        try {
            String rawJson = restClient.get()
                    .uri(jmaQuakeUrl)
                    .retrieve()
                    .body(String.class);

            if (rawJson == null || rawJson.isBlank()) {
                throw new IllegalStateException("JMA returned an empty response body");
            }

            JsonNode root = objectMapper.readTree(rawJson);
            if (root.isArray() && root.size() > 0) {
                JsonNode latest = root.get(0);

                AlertInfo alert = new AlertInfo();
                alert.setAlertType("earthquake");
                alert.setSource("Japan Meteorological Agency (JMA)");
                alert.setCachedAt(Instant.now().toString());
                alert.setCached(false);

                // Safe parsing of JMA json structure
                String anm = latest.has("anm") ? latest.get("anm").asText() : "地震速報";
                String at = latest.has("at") ? latest.get("at").asText() : Instant.now().toString();
                String maxInt = latest.has("maxInt") ? latest.get("maxInt").asText() : "1";

                String hypocenter = "日本近海 / Domestic Japan";
                String mag = "N/A";
                if (latest.has("hypocenter")) {
                    JsonNode hypo = latest.get("hypocenter");
                    if (hypo.has("name")) hypocenter = hypo.get("name").asText();
                    if (hypo.has("magnitude")) mag = "M" + hypo.get("magnitude").asText();
                }

                alert.setTitle(anm);
                alert.setAffectedArea(hypocenter);
                alert.setAnnouncementTime(at);
                alert.setIntensity("最大震度 " + maxInt);
                alert.setMagnitude(mag);

                int intNum = 1;
                try {
                    intNum = Integer.parseInt(maxInt.replaceAll("[^0-9]", ""));
                } catch (Exception ignored) {}

                if (intNum >= 5) alert.setSeverity("critical");
                else if (intNum >= 4) alert.setSeverity("warning");
                else if (intNum >= 2) alert.setSeverity("advisory");
                else alert.setSeverity("info");

                return alert;
            }

            throw new IllegalStateException("JMA response array is empty");
        } catch (Exception ex) {
            log.warn("JMA Client request failed or timed out: {}", ex.getMessage());
            throw new RuntimeException("JMA request failed: " + ex.getMessage(), ex);
        }
    }
}
