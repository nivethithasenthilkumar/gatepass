package com.college.gatepass.repository;

import com.college.gatepass.model.User;
import com.college.gatepass.model.UserRole;
import com.college.gatepass.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByRollNo(String rollNo);
    
    boolean existsByRollNo(String rollNo);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByDepartment(Department department);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.department = :department")
    List<User> findByRoleAndDepartment(@Param("role") UserRole role, @Param("department") Department department);
    
    @Query("SELECT u FROM User u WHERE u.role IN :roles")
    List<User> findByRoleIn(@Param("roles") List<UserRole> roles);
}