package com.safeguardjapan.service;

import com.safeguardjapan.mapper.ShelterMapper;
import com.safeguardjapan.model.Shelter;
import com.safeguardjapan.model.ShelterSearchForm;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelterService {

    private final ShelterMapper shelterMapper;

    public ShelterService(ShelterMapper shelterMapper) {
        this.shelterMapper = shelterMapper;
    }

    /**
     * Searches nearby shelters within radiusKm, filtered by disaster type,
     * sorted from nearest to farthest, limited to top 10.
     */
    public List<Shelter> searchNearbyShelters(ShelterSearchForm form) {
        List<Shelter> candidates = shelterMapper.findCandidateShelters(form.getDisasterType());

        double userLat = form.getLatitude().doubleValue();
        double userLon = form.getLongitude().doubleValue();
        double maxRadius = form.getRadiusKm() != null ? form.getRadiusKm() : 3.0;

        return candidates.stream()
                .peek(shelter -> {
                    double dist = calculateHaversineDistance(
                            userLat,
                            userLon,
                            shelter.getLatitude().doubleValue(),
                            shelter.getLongitude().doubleValue()
                    );
                    shelter.setDistanceKm(dist);
                    shelter.setEstimatedWalkingMinutes(estimateWalkingTimeMinutes(dist));

                    // Multilingual name selection
                    if ("en".equalsIgnoreCase(form.getLanguage()) && shelter.getNameEn() != null && !shelter.getNameEn().isBlank()) {
                        shelter.setNameJa(shelter.getNameEn());
                    }
                })
                .filter(shelter -> shelter.getDistanceKm() <= maxRadius)
                .sorted(Comparator.comparingDouble(Shelter::getDistanceKm))
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * Calculates distance in kilometers using the Haversine formula.
     */
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double EARTH_RADIUS_KM = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS_KM * c;

        // Round to 2 decimal places
        return Math.round(distance * 100.0) / 100.0;
    }

    /**
     * Estimates walking time at 80 meters per minute standard.
     */
    public int estimateWalkingTimeMinutes(double distanceKm) {
        if (distanceKm <= 0.0) return 1;
        double meters = distanceKm * 1000.0;
        int minutes = (int) Math.round(meters / 80.0);
        return Math.max(1, minutes);
    }
}
