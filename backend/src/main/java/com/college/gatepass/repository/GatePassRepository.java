package com.college.gatepass.repository;

import com.college.gatepass.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, Long> {
    
    List<GatePass> findByStudent(User student);
    
    List<GatePass> findByStudentOrderByCreatedAtDesc(User student);
    
    List<GatePass> findByStatus(PassStatus status);
    
    List<GatePass> findByStatusOrderByCreatedAtAsc(PassStatus status);
    
    // Using Derived Query Methods instead of @Query to avoid Enum mapping issues
    List<GatePass> findByStudentDepartmentAndStatusOrderByCreatedAtAsc(Department department, PassStatus status);
    
    List<GatePass> findByStudentDepartmentAndStudentYearAndStatusOrderByCreatedAtAsc(Department department, Year year, PassStatus status);
    
    List<GatePass> findByStudentHostelAndStatusInOrderByCreatedAtAsc(HostelType hostel, List<PassStatus> statuses);

    List<GatePass> findByStudentHostelAndStudentFloorNoAndStatusInOrderByCreatedAtAsc(HostelType hostel, String floorNo, List<PassStatus> statuses);
    
    @Query("SELECT gp FROM GatePass gp WHERE gp.createdAt BETWEEN :startDate AND :endDate ORDER BY gp.createdAt DESC")
    List<GatePass> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(gp) FROM GatePass gp WHERE gp.status = :status")
    long countByStatus(@Param("status") PassStatus status);
    
    @Query("SELECT gp FROM GatePass gp WHERE gp.status = 'APPROVED' AND gp.scannedOut IS NULL ORDER BY gp.createdAt ASC")
    List<GatePass> findApprovedNotScannedOut();
    
    @Query("SELECT gp FROM GatePass gp WHERE gp.status = 'APPROVED' AND gp.scannedOut IS NOT NULL AND gp.scannedIn IS NULL ORDER BY gp.scannedOut ASC")
    List<GatePass> findScannedOutNotIn();

    // Fallback for HOD/Advisor searches if enums fail
    @Query("SELECT gp FROM GatePass gp WHERE CAST(gp.student.department as string) = :dept AND gp.status = :status")
    List<GatePass> findByDeptString(@Param("dept") String dept, @Param("status") PassStatus status);
}