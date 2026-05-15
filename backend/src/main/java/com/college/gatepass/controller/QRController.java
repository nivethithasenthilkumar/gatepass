package com.college.gatepass.controller;

import com.college.gatepass.model.GatePass;
import com.college.gatepass.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/qr")
public class QRController {
    
    @Autowired
    private GatePassService gatePassService;
    
    @GetMapping("/gatepass/{id}")
    public ResponseEntity<?> getGatePassByQR(@PathVariable Long id) {
        Optional<GatePass> gatePass = gatePassService.findById(id);
        if (gatePass.isPresent()) {
            return ResponseEntity.ok(gatePass.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/scan/{id}")
    public ResponseEntity<?> scanQRCode(@PathVariable Long id, @RequestParam String action) {
        try {
            Optional<GatePass> optionalGatePass = gatePassService.findById(id);
            if (optionalGatePass.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            GatePass gatePass = optionalGatePass.get();
            
            // Return gate pass information for QR scan
            return ResponseEntity.ok(gatePass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}