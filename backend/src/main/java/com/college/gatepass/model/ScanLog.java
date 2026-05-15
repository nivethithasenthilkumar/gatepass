package com.college.gatepass.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "scan_logs")
public class ScanLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "pass_id", nullable = false)
    private Long passId;
    
    @NotNull
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @NotNull
    @Column(name = "student_name", nullable = false)
    private String studentName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ScanType type;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @NotNull
    @Column(name = "security_id", nullable = false)
    private Long securityId;
    
    // Constructors
    public ScanLog() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ScanLog(Long passId, Long studentId, String studentName, ScanType type, Long securityId) {
        this();
        this.passId = passId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.type = type;
        this.securityId = securityId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getPassId() { return passId; }
    public void setPassId(Long passId) { this.passId = passId; }
    
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public ScanType getType() { return type; }
    public void setType(ScanType type) { this.type = type; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public Long getSecurityId() { return securityId; }
    public void setSecurityId(Long securityId) { this.securityId = securityId; }
}