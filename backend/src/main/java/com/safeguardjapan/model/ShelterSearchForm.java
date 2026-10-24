package com.safeguardjapan.model;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class ShelterSearchForm {

    @NotNull(message = "{error.invalid_latitude}")
    @DecimalMin(value = "-90.0", message = "{error.invalid_latitude}")
    @DecimalMax(value = "90.0", message = "{error.invalid_latitude}")
    private BigDecimal latitude;

    @NotNull(message = "{error.invalid_longitude}")
    @DecimalMin(value = "-180.0", message = "{error.invalid_longitude}")
    @DecimalMax(value = "180.0", message = "{error.invalid_longitude}")
    private BigDecimal longitude;

    @Min(value = 1, message = "{error.invalid_radius}")
    @Max(value = 20, message = "{error.invalid_radius}")
    private Integer radiusKm = 3;

    @Pattern(regexp = "^(all|earthquake|tsunami|flood)$", message = "Invalid disasterType")
    private String disasterType = "all";

    @Pattern(regexp = "^(ja|en|bn|vi)$", message = "Invalid language")
    private String language = "ja";

    public ShelterSearchForm() {}

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Integer getRadiusKm() { return radiusKm; }
    public void setRadiusKm(Integer radiusKm) { this.radiusKm = radiusKm; }

    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
