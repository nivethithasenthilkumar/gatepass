package com.college.gatepass.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Year {
    FIRST("1st"),
    SECOND("2nd"),
    THIRD("3rd"),
    FOURTH("4th");
    
    private final String displayName;
    
    Year(String displayName) {
        this.displayName = displayName;
    }
    
    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}