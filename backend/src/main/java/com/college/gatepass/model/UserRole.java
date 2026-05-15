package com.college.gatepass.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    STUDENT,
    ADVISOR,
    HOD,
    WARDEN,
    DEPUTY_WARDEN,
    PRINCIPAL,
    SECURITY;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static UserRole forValue(String value) {
        if (value == null) return null;
        return UserRole.valueOf(value.toUpperCase());
    }
}