package com.safeguardjapan.model;

import java.math.BigDecimal;

public class Shelter {
    private Integer id;
    private String nameJa;
    private String nameEn;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Boolean isEarthquake;
    private Boolean isTsunami;
    private Boolean isFlood;
    private Integer capacity;
    
    // Computed fields for response
    private Double distanceKm;
    private Integer estimatedWalkingMinutes;

    public Shelter() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNameJa() { return nameJa; }
    public void setNameJa(String nameJa) { this.nameJa = nameJa; }

    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Boolean getIsEarthquake() { return isEarthquake; }
    public void setIsEarthquake(Boolean isEarthquake) { this.isEarthquake = isEarthquake; }

    public Boolean getIsTsunami() { return isTsunami; }
    public void setIsTsunami(Boolean isTsunami) { this.isTsunami = isTsunami; }

    public Boolean getIsFlood() { return isFlood; }
    public void setIsFlood(Boolean isFlood) { this.isFlood = isFlood; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedWalkingMinutes() { return estimatedWalkingMinutes; }
    public void setEstimatedWalkingMinutes(Integer estimatedWalkingMinutes) { this.estimatedWalkingMinutes = estimatedWalkingMinutes; }
}
