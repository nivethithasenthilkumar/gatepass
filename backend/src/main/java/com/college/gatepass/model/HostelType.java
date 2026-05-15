package com.college.gatepass.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum HostelType {
    G,
    BH1,
    BH2,
    BH3,
    DAYSCHOLAR;

    @JsonValue
    public String toValue() {
        if (this == DAYSCHOLAR) return "dayscholar";
        return name();
    }

    @JsonCreator
    public static HostelType forValue(String value) {
        if (value == null) return null;
        if (value.equalsIgnoreCase("dayscholar")) return DAYSCHOLAR;
        return HostelType.valueOf(value.toUpperCase());
    }
}