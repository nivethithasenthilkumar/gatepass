package com.college.gatepass.service;

import com.college.gatepass.dto.RegisterRequest;
import com.college.gatepass.model.User;
import com.college.gatepass.model.UserRole;
import com.college.gatepass.model.Department;
import com.college.gatepass.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(RegisterRequest registerRequest) {
        if (userRepository.existsByRollNo(registerRequest.getRollNo())) {
            throw new RuntimeException("Error: Roll Number is already taken!");
        }
        
        User user = new User();
        user.setRollNo(registerRequest.getRollNo());
        user.setName(registerRequest.getName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());
        user.setDepartment(registerRequest.getDepartment());
        user.setYear(registerRequest.getYear());
        user.setHostel(registerRequest.getHostel());
        user.setRoomNo(registerRequest.getRoomNo());
        user.setParentPhone(registerRequest.getParentPhone());
        user.setFloorNo(registerRequest.getFloorNo());
        user.setPhoto(registerRequest.getPhoto());
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByRollNo(String rollNo) {
        return userRepository.findByRollNo(rollNo);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> findByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> findByDepartment(Department department) {
        return userRepository.findByDepartment(department);
    }
    
    public List<User> findByRoleAndDepartment(UserRole role, Department department) {
        return userRepository.findByRoleAndDepartment(role, department);
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public boolean existsByRollNo(String rollNo) {
        return userRepository.existsByRollNo(rollNo);
    }
}