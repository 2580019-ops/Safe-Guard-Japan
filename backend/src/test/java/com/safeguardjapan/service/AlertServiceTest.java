package com.safeguardjapan.service;

import com.safeguardjapan.client.JmaClient;
import com.safeguardjapan.model.AlertInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private JmaClient jmaClient;

    @Mock
    private PhraseService phraseService;

    private AlertService alertService;

    @BeforeEach
    void setUp() {
        alertService = new AlertService(jmaClient, phraseService);
    }

    @Test
    @DisplayName("Should successfully return live JMA alert and localize into requested language")
    void testSuccessfulAlertRetrieval() {
        AlertInfo mockAlert = new AlertInfo();
        mockAlert.setAlertType("earthquake");
        mockAlert.setAffectedArea("千葉県北東部");
        mockAlert.setIntensity("最大震度 3");
        mockAlert.setMagnitude("M4.2");
        mockAlert.setSeverity("advisory");

        when(jmaClient.fetchLatestEarthquake()).thenReturn(mockAlert);

        AlertInfo result = alertService.getDisasterAlert("en");

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("JMA Seismic Intensity Information");
        assertThat(result.getAffectedArea()).isEqualTo("千葉県北東部");
        assertThat(result.isCached()).isFalse();
    }

    @Test
    @DisplayName("Should fall back to previous cached data or baseline when JMA client times out")
    void testTimeoutFallback() {
        when(jmaClient.fetchLatestEarthquake()).thenThrow(new RuntimeException("Connection timed out after 3000ms"));

        AlertInfo fallback = alertService.getDisasterAlert("ja");

        assertThat(fallback).isNotNull();
        assertThat(fallback.isCached()).isTrue();
        assertThat(fallback.getAffectedArea()).contains("全国");
    }

    @Test
    @DisplayName("Should fallback unsupported language to Japanese")
    void testUnsupportedLanguageFallback() {
        assertThat(alertService.normalizeLanguage("fr")).isEqualTo("ja");
        assertThat(alertService.normalizeLanguage("de")).isEqualTo("ja");
        assertThat(alertService.normalizeLanguage(null)).isEqualTo("ja");
        assertThat(alertService.normalizeLanguage("EN")).isEqualTo("en");
        assertThat(alertService.normalizeLanguage("bn")).isEqualTo("bn");
        assertThat(alertService.normalizeLanguage("vi")).isEqualTo("vi");
    }
}
