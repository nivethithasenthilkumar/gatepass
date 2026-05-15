package com.college.gatepass.service;

import com.college.gatepass.dto.GatePassRequest;
import com.college.gatepass.model.*;
import com.college.gatepass.repository.GatePassRepository;
import com.college.gatepass.repository.ApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GatePassService {
    
    @Autowired
    private GatePassRepository gatePassRepository;
    
    @Autowired
    private ApprovalRepository approvalRepository;
    
    @Autowired
    private ScanLogService scanLogService;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    public GatePass createGatePass(GatePassRequest request, User student) {
        GatePass gatePass = new GatePass();
        gatePass.setStudent(student);
        gatePass.setPurpose(request.getPurpose());
        gatePass.setNativePlace(request.getNativePlace());
        gatePass.setOutDateTime(request.getOutDateTime());
        gatePass.setInDateTime(request.getInDateTime());
        gatePass.setPassType(request.getPassType());
        
        // Determine initial status based on time and hostel type
        LocalDateTime now = LocalDateTime.now();
        int hour = now.getHour();
        boolean isAfterHours = hour < 9 || hour >= 17;
        
        if (isAfterHours && student.isHosteler()) {
            gatePass.setStatus(PassStatus.PENDING_WARDEN);
        } else {
            gatePass.setStatus(PassStatus.PENDING_ADVISOR);
        }
        
        GatePass savedPass = gatePassRepository.save(gatePass);
        
        // Generate QR Code
        try {
            String qrCodeData = qrCodeService.generateQRCode(savedPass);
            savedPass.setQrCode(qrCodeData);
            savedPass = gatePassRepository.save(savedPass);
        } catch (Exception e) {
            // Log error but don't fail the creation
            System.err.println("Failed to generate QR code: " + e.getMessage());
        }
        
        return savedPass;
    }
    
    public Optional<GatePass> findById(Long id) {
        return gatePassRepository.findById(id);
    }
    
    public List<GatePass> findByStudent(User student) {
        return gatePassRepository.findByStudentOrderByCreatedAtDesc(student);
    }
    
    public List<GatePass> findByStatus(PassStatus status) {
        return gatePassRepository.findByStatusOrderByCreatedAtAsc(status);
    }
    
    public List<GatePass> findPendingForRole(UserRole role, User approver) {
        switch (role) {
            case ADVISOR:
                // Advisor sees students from their own department AND their own year
                return gatePassRepository.findByStudentDepartmentAndStudentYearAndStatusOrderByCreatedAtAsc(
                    approver.getDepartment(), approver.getYear(), PassStatus.PENDING_ADVISOR);
            case HOD:
                // HOD sees all students from their department
                return gatePassRepository.findByStudentDepartmentAndStatusOrderByCreatedAtAsc(
                    approver.getDepartment(), PassStatus.PENDING_HOD);
            case PRINCIPAL:
                return gatePassRepository.findByStatus(PassStatus.PENDING_PRINCIPAL);
            case WARDEN:
                // Warden sees students from their specific hostel AND their assigned floor
                return gatePassRepository.findByStudentHostelAndStudentFloorNoAndStatusInOrderByCreatedAtAsc(
                    approver.getHostel(), 
                    approver.getFloorNo(),
                    List.of(PassStatus.PENDING_WARDEN));
            case DEPUTY_WARDEN:
                // Deputy Warden sees all pending requests for their hostel
                return gatePassRepository.findByStudentHostelAndStatusInOrderByCreatedAtAsc(
                    approver.getHostel(), 
                    List.of(PassStatus.PENDING_DEPUTY_WARDEN));
            default:
                return List.of();
        }
    }
    
    public GatePass approveGatePass(Long gatePassId, User approver, String comment) {
        Optional<GatePass> optionalGatePass = gatePassRepository.findById(gatePassId);
        if (optionalGatePass.isEmpty()) {
            throw new RuntimeException("Gate pass not found");
        }
        
        GatePass gatePass = optionalGatePass.get();
        
        // Create approval record
        Approval approval = new Approval(gatePass, approver.getRole(), approver.getId(), 
                                       approver.getName(), ApprovalStatus.APPROVED);
        approval.setComment(comment);
        approvalRepository.save(approval);
        
        // Update gate pass status
        PassStatus nextStatus = getNextApprovalStatus(gatePass.getStatus(), gatePass.getStudent().isHosteler());
        gatePass.setStatus(nextStatus);
        
        return gatePassRepository.save(gatePass);
    }
    
    public GatePass rejectGatePass(Long gatePassId, User approver, String comment) {
        Optional<GatePass> optionalGatePass = gatePassRepository.findById(gatePassId);
        if (optionalGatePass.isEmpty()) {
            throw new RuntimeException("Gate pass not found");
        }
        
        GatePass gatePass = optionalGatePass.get();
        
        // Create approval record
        Approval approval = new Approval(gatePass, approver.getRole(), approver.getId(), 
                                       approver.getName(), ApprovalStatus.REJECTED);
        approval.setComment(comment);
        approvalRepository.save(approval);
        
        // Update gate pass status
        gatePass.setStatus(PassStatus.REJECTED);
        
        return gatePassRepository.save(gatePass);
    }
    
    private PassStatus getNextApprovalStatus(PassStatus currentStatus, boolean isHosteler) {
        switch (currentStatus) {
            case PENDING_ADVISOR:
                return PassStatus.PENDING_HOD;
            case PENDING_HOD:
                return PassStatus.PENDING_PRINCIPAL;
            case PENDING_PRINCIPAL:
                return isHosteler ? PassStatus.PENDING_WARDEN : PassStatus.APPROVED;
            case PENDING_WARDEN:
                return PassStatus.PENDING_DEPUTY_WARDEN;
            case PENDING_DEPUTY_WARDEN:
                return PassStatus.APPROVED;
            default:
                return PassStatus.APPROVED;
        }
    }
    
    public List<GatePass> findAll() {
        return gatePassRepository.findAll();
    }
    
    public List<GatePass> findApprovedNotScannedOut() {
        return gatePassRepository.findApprovedNotScannedOut();
    }
    
    public List<GatePass> findScannedOutNotIn() {
        return gatePassRepository.findScannedOutNotIn();
    }
    
    public GatePass scanOut(Long gatePassId, User security) {
        Optional<GatePass> optionalGatePass = gatePassRepository.findById(gatePassId);
        if (optionalGatePass.isEmpty()) {
            throw new RuntimeException("Gate pass not found");
        }
        
        GatePass gatePass = optionalGatePass.get();
        if (!gatePass.getStatus().equals(PassStatus.APPROVED)) {
            throw new RuntimeException("Gate pass is not approved");
        }
        
        gatePass.setScannedOut(LocalDateTime.now());
        GatePass savedPass = gatePassRepository.save(gatePass);
        
        // Create scan log
        scanLogService.createScanLog(gatePass.getId(), gatePass.getStudent().getId(), 
                                   gatePass.getStudent().getName(), ScanType.OUT, security.getId());
        
        return savedPass;
    }
    
    public GatePass scanIn(Long gatePassId, User security) {
        Optional<GatePass> optionalGatePass = gatePassRepository.findById(gatePassId);
        if (optionalGatePass.isEmpty()) {
            throw new RuntimeException("Gate pass not found");
        }
        
        GatePass gatePass = optionalGatePass.get();
        if (gatePass.getScannedOut() == null) {
            throw new RuntimeException("Student has not scanned out yet");
        }
        
        gatePass.setScannedIn(LocalDateTime.now());
        GatePass savedPass = gatePassRepository.save(gatePass);
        
        // Create scan log
        scanLogService.createScanLog(gatePass.getId(), gatePass.getStudent().getId(), 
                                   gatePass.getStudent().getName(), ScanType.IN, security.getId());
        
        return savedPass;
    }
}