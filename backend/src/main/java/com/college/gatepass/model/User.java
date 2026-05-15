package com.college.gatepass.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "roll_no", unique = true, nullable = false)
    @NotBlank(message = "Roll number is required")
    private String rollNo;
    
    @Column(name = "name", nullable = false)
    @NotBlank(message = "Name is required")
    @Size(min = 2, message = "Name must be at least 2 characters")
    private String name;
    
    @JsonIgnore
    @Column(name = "password", nullable = false)
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "department")
    private Department department;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "student_year")
    private Year year;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "hostel")
    private HostelType hostel;
    
    @Column(name = "room_no")
    private String roomNo;
    
    @Column(name = "floor_no")
    private String floorNo;
    
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    @Column(name = "parent_phone")
    private String parentPhone;
    
    @Column(name = "photo")
    private String photo;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<GatePass> gatePasses;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public User(String rollNo, String name, String password, UserRole role) {
        this();
        this.rollNo = rollNo;
        this.name = name;
        this.password = password;
        this.role = role;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
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
    
    public String getFloorNo() { return floorNo; }
    public void setFloorNo(String floorNo) { this.floorNo = floorNo; }
    
    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }
    
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<GatePass> getGatePasses() { return gatePasses; }
    public void setGatePasses(List<GatePass> gatePasses) { this.gatePasses = gatePasses; }
    
    public boolean isHosteler() {
        return hostel != null && !hostel.equals(HostelType.DAYSCHOLAR);
    }
}