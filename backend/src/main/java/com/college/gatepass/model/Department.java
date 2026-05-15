package com.college.gatepass.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Department {
    CSE,
    CCE,
    AIML,
    AIDS,
    MECH,
    CIVIL;

    @JsonValue
    public String toValue() {
        return name();
    }

    @JsonCreator
    public static Department forValue(String value) {
        if (value == null) return null;
        return Department.valueOf(value.toUpperCase());
    }
}