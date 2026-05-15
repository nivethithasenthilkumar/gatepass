package com.college.gatepass.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {
    
    @NotBlank(message = "Roll number is required")
    private String rollNo;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    // Constructors
    public LoginRequest() {}
    
    public LoginRequest(String rollNo, String password) {
        this.rollNo = rollNo;
        this.password = password;
    }
    
    // Getters and Setters
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}