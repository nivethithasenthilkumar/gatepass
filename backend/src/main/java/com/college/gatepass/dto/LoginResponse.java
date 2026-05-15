package com.college.gatepass.dto;

import com.college.gatepass.model.UserRole;
import com.college.gatepass.model.Department;
import com.college.gatepass.model.Year;
import com.college.gatepass.model.HostelType;

public class LoginResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String rollNo;
    private String name;
    private UserRole role;
    private Department department;
    private Year year;
    private HostelType hostel;
    private String roomNo;
    private String parentPhone;
    private String floorNo;
    private String photo;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String token, Long id, String rollNo, String name, UserRole role) {
        this.token = token;
        this.id = id;
        this.rollNo = rollNo;
        this.name = name;
        this.role = role;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    
    public Year getYear() { return year; }
    public void setYear(Year year) { this.year = year; }
    
    public HostelType getHostel() { return hostel; }
    public void setHostel(HostelType hostel) { this.hostel = hostel; }
    
    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
    
    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }
    
    public String getFloorNo() { return floorNo; }
    public void setFloorNo(String floorNo) { this.floorNo = floorNo; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}