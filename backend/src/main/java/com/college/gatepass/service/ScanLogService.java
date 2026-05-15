package com.college.gatepass.service;

import com.college.gatepass.model.ScanLog;
import com.college.gatepass.model.ScanType;
import com.college.gatepass.repository.ScanLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ScanLogService {
    
    @Autowired
    private ScanLogRepository scanLogRepository;
    
    public ScanLog createScanLog(Long passId, Long studentId, String studentName, ScanType type, Long securityId) {
        ScanLog scanLog = new ScanLog(passId, studentId, studentName, type, securityId);
        return scanLogRepository.save(scanLog);
    }
    
    public List<ScanLog> findByPassId(Long passId) {
        return scanLogRepository.findByPassId(passId);
    }
    
    public List<ScanLog> findByStudentId(Long studentId) {
        return scanLogRepository.findByStudentId(studentId);
    }
    
    public List<ScanLog> findByType(ScanType type) {
        return scanLogRepository.findByType(type);
    }
    
    public List<ScanLog> findBySecurityId(Long securityId) {
        return scanLogRepository.findBySecurityId(securityId);
    }
    
    public List<ScanLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return scanLogRepository.findByTimestampBetween(startDate, endDate);
    }
    
    public List<ScanLog> findAllOrderByTimestampDesc() {
        return scanLogRepository.findAllOrderByTimestampDesc();
    }
}