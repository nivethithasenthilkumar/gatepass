package com.college.gatepass.controller;

import com.college.gatepass.dto.ApprovalRequest;
import com.college.gatepass.dto.GatePassRequest;
import com.college.gatepass.model.GatePass;
import com.college.gatepass.model.User;
import com.college.gatepass.model.UserRole;
import com.college.gatepass.security.UserPrincipal;
import com.college.gatepass.service.GatePassService;
import com.college.gatepass.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/gatepasses")
public class GatePassController {
    
    @Autowired
    private GatePassService gatePassService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createGatePass(@Valid @RequestBody GatePassRequest request, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User student = userService.findByRollNo(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            GatePass gatePass = gatePassService.createGatePass(request, student);
            return ResponseEntity.ok(gatePass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<GatePass>> getAllGatePasses(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.findByRollNo(userPrincipal.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<GatePass> gatePasses;
        if (user.getRole() == UserRole.STUDENT) {
            gatePasses = gatePassService.findByStudent(user);
        } else {
            gatePasses = gatePassService.findPendingForRole(user.getRole(), user);
        }
        
        return ResponseEntity.ok(gatePasses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getGatePassById(@PathVariable Long id) {
        Optional<GatePass> gatePass = gatePassService.findById(id);
        if (gatePass.isPresent()) {
            return ResponseEntity.ok(gatePass.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADVISOR') or hasRole('HOD') or hasRole('PRINCIPAL') or hasRole('WARDEN') or hasRole('DEPUTY_WARDEN')")
    public ResponseEntity<?> approveGatePass(@PathVariable Long id, @RequestBody ApprovalRequest request, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User approver = userService.findByRollNo(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            GatePass gatePass;
            if (request.getStatus().name().equals("APPROVED")) {
                gatePass = gatePassService.approveGatePass(id, approver, request.getComment());
            } else {
                gatePass = gatePassService.rejectGatePass(id, approver, request.getComment());
            }
            
            return ResponseEntity.ok(gatePass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<GatePass>> getPendingGatePasses(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.findByRollNo(userPrincipal.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<GatePass> pendingPasses = gatePassService.findPendingForRole(user.getRole(), user);
        return ResponseEntity.ok(pendingPasses);
    }
    
    @GetMapping("/approved")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<List<GatePass>> getApprovedGatePasses() {
        List<GatePass> approvedPasses = gatePassService.findApprovedNotScannedOut();
        return ResponseEntity.ok(approvedPasses);
    }
    
    @GetMapping("/scanned-out")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<List<GatePass>> getScannedOutGatePasses() {
        List<GatePass> scannedOutPasses = gatePassService.findScannedOutNotIn();
        return ResponseEntity.ok(scannedOutPasses);
    }
    
    @PostMapping("/{id}/scan-out")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<?> scanOut(@PathVariable Long id, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User security = userService.findByRollNo(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            GatePass gatePass = gatePassService.scanOut(id, security);
            return ResponseEntity.ok(gatePass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/scan-in")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<?> scanIn(@PathVariable Long id, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User security = userService.findByRollNo(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            GatePass gatePass = gatePassService.scanIn(id, security);
            return ResponseEntity.ok(gatePass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}