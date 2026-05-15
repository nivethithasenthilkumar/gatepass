package com.college.gatepass.dto;

import com.college.gatepass.model.PassType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class GatePassRequest {
    
    @NotBlank(message = "Purpose is required")
    private String purpose;
    
    @NotBlank(message = "Native place is required")
    private String nativePlace;
    
    @NotNull(message = "Out date time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime outDateTime;
    
    @NotNull(message = "In date time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime inDateTime;
    
    @NotNull(message = "Pass type is required")
    private PassType passType;
    
    // Constructors
    public GatePassRequest() {}
    
    public GatePassRequest(String purpose, String nativePlace, LocalDateTime outDateTime, LocalDateTime inDateTime, PassType passType) {
        this.purpose = purpose;
        this.nativePlace = nativePlace;
        this.outDateTime = outDateTime;
        this.inDateTime = inDateTime;
        this.passType = passType;
    }
    
    // Getters and Setters
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    
    public String getNativePlace() { return nativePlace; }
    public void setNativePlace(String nativePlace) { this.nativePlace = nativePlace; }
    
    public LocalDateTime getOutDateTime() { return outDateTime; }
    public void setOutDateTime(LocalDateTime outDateTime) { this.outDateTime = outDateTime; }
    
    public LocalDateTime getInDateTime() { return inDateTime; }
    public void setInDateTime(LocalDateTime inDateTime) { this.inDateTime = inDateTime; }
    
    public PassType getPassType() { return passType; }
    public void setPassType(PassType passType) { this.passType = passType; }
}