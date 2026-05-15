package com.college.gatepass.repository;

import com.college.gatepass.model.Approval;
import com.college.gatepass.model.GatePass;
import com.college.gatepass.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    
    List<Approval> findByGatePass(GatePass gatePass);
    
    List<Approval> findByGatePassOrderByTimestampAsc(GatePass gatePass);
    
    Optional<Approval> findByGatePassAndRole(GatePass gatePass, UserRole role);
    
    List<Approval> findByUserId(Long userId);
    
    List<Approval> findByRole(UserRole role);
}