package com.college.gatepass.repository;

import com.college.gatepass.model.ScanLog;
import com.college.gatepass.model.ScanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScanLogRepository extends JpaRepository<ScanLog, Long> {
    
    List<ScanLog> findByPassId(Long passId);
    
    List<ScanLog> findByStudentId(Long studentId);
    
    List<ScanLog> findByType(ScanType type);
    
    List<ScanLog> findBySecurityId(Long securityId);
    
    @Query("SELECT sl FROM ScanLog sl WHERE sl.timestamp BETWEEN :startDate AND :endDate ORDER BY sl.timestamp DESC")
    List<ScanLog> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT sl FROM ScanLog sl ORDER BY sl.timestamp DESC")
    List<ScanLog> findAllOrderByTimestampDesc();
}