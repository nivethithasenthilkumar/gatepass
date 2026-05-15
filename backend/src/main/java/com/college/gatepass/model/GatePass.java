package com.college.gatepass.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gate_passes")
public class GatePass {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @NotBlank(message = "Purpose is required")
    @Column(name = "purpose", nullable = false)
    private String purpose;
    
    @NotBlank(message = "Native place is required")
    @Column(name = "native_place", nullable = false)
    private String nativePlace;
    
    @NotNull(message = "Out date time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "out_date_time", nullable = false)
    private LocalDateTime outDateTime;
    
    @NotNull(message = "In date time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "in_date_time", nullable = false)
    private LocalDateTime inDateTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "pass_type", nullable = false)
    private PassType passType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PassStatus status;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "gatePass", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Approval> approvals = new ArrayList<>();
    
    @Column(name = "qr_code", length = 1000)
    private String qrCode;
    
    @Column(name = "scanned_out")
    private LocalDateTime scannedOut;
    
    @Column(name = "scanned_in")
    private LocalDateTime scannedIn;
    
    // Constructors
    public GatePass() {
        this.createdAt = LocalDateTime.now();
        this.status = PassStatus.PENDING_ADVISOR;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    
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
    
    public PassStatus getStatus() { return status; }
    public void setStatus(PassStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Approval> getApprovals() { return approvals; }
    public void setApprovals(List<Approval> approvals) { this.approvals = approvals; }
    
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    
    public LocalDateTime getScannedOut() { return scannedOut; }
    public void setScannedOut(LocalDateTime scannedOut) { this.scannedOut = scannedOut; }
    
    public LocalDateTime getScannedIn() { return scannedIn; }
    public void setScannedIn(LocalDateTime scannedIn) { this.scannedIn = scannedIn; }
}