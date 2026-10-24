package com.safeguardjapan.service;

import com.safeguardjapan.client.JmaClient;
import com.safeguardjapan.model.AlertInfo;
import com.safeguardjapan.model.Phrase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);
    private static final Set<String> SUPPORTED_LANGUAGES = Set.of("ja", "en", "bn", "vi");

    private final JmaClient jmaClient;
    private final PhraseService phraseService;
    private volatile AlertInfo lastSuccessfulAlert = null;

    public AlertService(JmaClient jmaClient, PhraseService phraseService) {
        this.jmaClient = jmaClient;
        this.phraseService = phraseService;
    }

    /**
     * Retrieves disaster alert with 60-second caching.
     * In case of network timeout or error, returns the most recent cached result.
     */
    @Cacheable(value = "jmaAlertCache", key = "#language")
    public AlertInfo getDisasterAlert(String language) {
        String safeLang = normalizeLanguage(language);

        try {
            AlertInfo liveAlert = jmaClient.fetchLatestEarthquake();
            localizeAlert(liveAlert, safeLang);
            this.lastSuccessfulAlert = liveAlert;
            return liveAlert;
        } catch (Exception ex) {
            log.warn("JMA fetch error. Attempting cached or baseline fallback: {}", ex.getMessage());

            if (lastSuccessfulAlert != null) {
                AlertInfo cachedCopy = copyAlert(lastSuccessfulAlert);
                cachedCopy.setCached(true);
                localizeAlert(cachedCopy, safeLang);
                return cachedCopy;
            }

            // Return safe offline baseline
            AlertInfo baseline = new AlertInfo();
            baseline.setAlertType("info");
            baseline.setAffectedArea("全国 (Nationwide)");
            baseline.setAnnouncementTime(Instant.now().toString());
            baseline.setIntensity("平常時 (Normal)");
            baseline.setMagnitude("N/A");
            baseline.setSeverity("info");
            baseline.setSource("Japan Meteorological Agency (Baseline)");
            baseline.setCached(true);
            localizeAlert(baseline, safeLang);
            return baseline;
        }
    }

    public String normalizeLanguage(String lang) {
        if (lang == null || !SUPPORTED_LANGUAGES.contains(lang.toLowerCase())) {
            return "ja";
        }
        return lang.toLowerCase();
    }

    private void localizeAlert(AlertInfo alert, String lang) {
        if ("critical".equalsIgnoreCase(alert.getSeverity())) {
            Phrase p = phraseService.getPhraseByKey("emergency_actions", "earthquake_action");
            if (p != null) {
                alert.setInstructions(getLocalizedText(p, lang));
            } else {
                alert.setInstructions("頭部を守り、机の下などに身を隠してください。");
            }
        } else {
            alert.setInstructions(getLocalizedDefaultInstructions(lang));
        }

        if ("ja".equals(lang)) {
            alert.setTitle("気象庁 地震速報（震度情報）");
        } else if ("en".equals(lang)) {
            alert.setTitle("JMA Seismic Intensity Information");
        } else if ("bn".equals(lang)) {
            alert.setTitle("জেএমএ ভূমিকম্প তীব্রতা তথ্য");
        } else if ("vi".equals(lang)) {
            alert.setTitle("Thông tin độ rung chấn động đất JMA");
        }
    }

    private String getLocalizedText(Phrase phrase, String lang) {
        return switch (lang) {
            case "en" -> phrase.getTextEn() != null ? phrase.getTextEn() : phrase.getTextJa();
            case "bn" -> phrase.getTextBn() != null ? phrase.getTextBn() : phrase.getTextJa();
            case "vi" -> phrase.getTextVi() != null ? phrase.getTextVi() : phrase.getTextJa();
            default -> phrase.getTextJa();
        };
    }

    private String getLocalizedDefaultInstructions(String lang) {
        return switch (lang) {
            case "en" -> "Conditions are currently calm. Review emergency supplies and designated meeting points.";
            case "bn" -> "পরিস্থিতি শান্ত। জরুরি সরবরাহ এবং পরিবার মিলনের স্থান পরীক্ষা করে রাখুন।";
            case "vi" -> "Tình hình hiện ổn định. Kiểm tra vật dụng khẩn cấp và lộ trình sơ tán.";
            default -> "平常時です。非常用持ち出し袋と避難経路の点検を推奨します。";
        };
    }

    private AlertInfo copyAlert(AlertInfo src) {
        AlertInfo dest = new AlertInfo();
        dest.setAlertType(src.getAlertType());
        dest.setTitle(src.getTitle());
        dest.setAffectedArea(src.getAffectedArea());
        dest.setAnnouncementTime(src.getAnnouncementTime());
        dest.setIntensity(src.getIntensity());
        dest.setMagnitude(src.getMagnitude());
        dest.setSeverity(src.getSeverity());
        dest.setSource(src.getSource());
        dest.setCachedAt(src.getCachedAt());
        dest.setInstructions(src.getInstructions());
        dest.setCached(src.isCached());
        return dest;
    }
}
