package com.safeguardjapan.service;

import com.safeguardjapan.mapper.ShelterMapper;
import com.safeguardjapan.model.Shelter;
import com.safeguardjapan.model.ShelterSearchForm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShelterServiceTest {

    @Mock
    private ShelterMapper shelterMapper;

    private ShelterService shelterService;

    @BeforeEach
    void setUp() {
        shelterService = new ShelterService(shelterMapper);
    }

    @Test
    @DisplayName("Should accurately calculate Haversine distance between Tokyo station and Shinjuku")
    void testHaversineDistanceCalculation() {
        // Tokyo Station (35.681236, 139.767125) to Shinjuku Station (35.689606, 139.700571) ~ 6.09 km
        double distance = shelterService.calculateHaversineDistance(35.681236, 139.767125, 35.689606, 139.700571);
        assertThat(distance).isCloseTo(6.09, offset(0.2));
    }

    @Test
    @DisplayName("Should estimate walking time at 80 meters per minute")
    void testWalkingTimeEstimation() {
        // 0.8 km = 800m -> 800 / 80 = 10 minutes
        int minutes = shelterService.estimateWalkingTimeMinutes(0.8);
        assertThat(minutes).isEqualTo(10);

        // 1.6 km = 1600m -> 1600 / 80 = 20 minutes
        int minutes2 = shelterService.estimateWalkingTimeMinutes(1.6);
        assertThat(minutes2).isEqualTo(20);

        // 0 km should default to at least 1 minute minimum
        int minDefault = shelterService.estimateWalkingTimeMinutes(0.0);
        assertThat(minDefault).isEqualTo(1);
    }

    @Test
    @DisplayName("Should filter within radius boundary and sort nearest to farthest")
    void testRadiusFilteringAndSorting() {
        Shelter near = new Shelter();
        near.setId(1);
        near.setNameJa("近所避難所 (Near)");
        near.setLatitude(new BigDecimal("35.6895"));
        near.setLongitude(new BigDecimal("139.6917"));
        near.setIsEarthquake(true);

        Shelter medium = new Shelter();
        medium.setId(2);
        medium.setNameJa("中間避難所 (Medium)");
        medium.setLatitude(new BigDecimal("35.6717"));
        medium.setLongitude(new BigDecimal("139.6949"));
        medium.setIsEarthquake(true);

        Shelter far = new Shelter();
        far.setId(3);
        far.setNameJa("遠方避難所 (Far)");
        far.setLatitude(new BigDecimal("35.7140"));
        far.setLongitude(new BigDecimal("139.7741"));
        far.setIsEarthquake(true);

        when(shelterMapper.findCandidateShelters("all")).thenReturn(Arrays.asList(far, near, medium));

        ShelterSearchForm form = new ShelterSearchForm();
        form.setLatitude(new BigDecimal("35.6896"));
        form.setLongitude(new BigDecimal("139.6920"));
        form.setRadiusKm(3); // 3 km radius cutoff
        form.setDisasterType("all");
        form.setLanguage("ja");

        List<Shelter> results = shelterService.searchNearbyShelters(form);

        // Only near and medium should be within 3km, sorted by distance
        assertThat(results).isNotEmpty();
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getId()).isEqualTo(1);
        assertThat(results.get(1).getId()).isEqualTo(2);
        assertThat(results.get(0).getDistanceKm()).isLessThan(results.get(1).getDistanceKm());
    }

    @Test
    @DisplayName("Should filter by disaster type suitability")
    void testDisasterTypeFiltering() {
        Shelter tsunamiOnly = new Shelter();
        tsunamiOnly.setId(10);
        tsunamiOnly.setNameJa("津波避難ビル");
        tsunamiOnly.setLatitude(new BigDecimal("35.6715"));
        tsunamiOnly.setLongitude(new BigDecimal("139.7995"));
        tsunamiOnly.setIsTsunami(true);

        when(shelterMapper.findCandidateShelters("tsunami")).thenReturn(List.of(tsunamiOnly));

        ShelterSearchForm form = new ShelterSearchForm();
        form.setLatitude(new BigDecimal("35.6715"));
        form.setLongitude(new BigDecimal("139.7995"));
        form.setRadiusKm(5);
        form.setDisasterType("tsunami");
        form.setLanguage("ja");

        List<Shelter> results = shelterService.searchNearbyShelters(form);
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo(10);
    }
}
