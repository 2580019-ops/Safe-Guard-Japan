package com.safeguardjapan.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ShelterSearchFormTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Valid coordinates and radius within 1-20 km should have no violations")
    void testValidForm() {
        ShelterSearchForm form = new ShelterSearchForm();
        form.setLatitude(new BigDecimal("35.6895"));
        form.setLongitude(new BigDecimal("139.6917"));
        form.setRadiusKm(5);
        form.setDisasterType("earthquake");
        form.setLanguage("ja");

        Set<ConstraintViolation<ShelterSearchForm>> violations = validator.validate(form);
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("Invalid latitude outside -90 to 90 should violate constraint")
    void testInvalidLatitude() {
        ShelterSearchForm form = new ShelterSearchForm();
        form.setLatitude(new BigDecimal("95.0")); // Out of bounds
        form.setLongitude(new BigDecimal("139.6917"));
        form.setRadiusKm(3);

        Set<ConstraintViolation<ShelterSearchForm>> violations = validator.validate(form);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("latitude"));
    }

    @Test
    @DisplayName("Radius under 1 km or over 20 km should violate constraint")
    void testInvalidRadius() {
        ShelterSearchForm formTooLow = new ShelterSearchForm();
        formTooLow.setLatitude(new BigDecimal("35.6895"));
        formTooLow.setLongitude(new BigDecimal("139.6917"));
        formTooLow.setRadiusKm(0);

        Set<ConstraintViolation<ShelterSearchForm>> vLow = validator.validate(formTooLow);
        assertThat(vLow).anyMatch(v -> v.getPropertyPath().toString().equals("radiusKm"));

        ShelterSearchForm formTooHigh = new ShelterSearchForm();
        formTooHigh.setLatitude(new BigDecimal("35.6895"));
        formTooHigh.setLongitude(new BigDecimal("139.6917"));
        formTooHigh.setRadiusKm(25);

        Set<ConstraintViolation<ShelterSearchForm>> vHigh = validator.validate(formTooHigh);
        assertThat(vHigh).anyMatch(v -> v.getPropertyPath().toString().equals("radiusKm"));
    }
}
