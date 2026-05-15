package com.college.gatepass.dto;

import com.college.gatepass.model.ApprovalStatus;
import jakarta.validation.constraints.NotNull;

public class ApprovalRequest {
    
    @NotNull(message = "Status is required")
    private ApprovalStatus status;
    
    private String comment;
    
    // Constructors
    public ApprovalRequest() {}
    
    public ApprovalRequest(ApprovalStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }
    
    // Getters and Setters
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}