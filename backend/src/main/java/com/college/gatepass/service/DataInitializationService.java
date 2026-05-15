package com.college.gatepass.service;

import com.college.gatepass.model.*;
import com.college.gatepass.repository.UserRepository;
import com.college.gatepass.repository.ScanLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ScanLogRepository scanLogRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            if (userRepository.count() == 0) {
                initializeUsers();
                System.out.println("Sample users created successfully!");
            }
        } catch (Exception e) {
            System.err.println("Error initializing data: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void initializeUsers() {
        // Create your user account
        createUser("root", "Root User", "nive1703@Nk", UserRole.STUDENT, Department.CSE, Year.THIRD, HostelType.BH1, "101", "9876543210");
        
        // Create sample students
        createUser("STU001", "John Doe", "password123", UserRole.STUDENT, Department.CSE, Year.THIRD, HostelType.BH1, "101", "9876543210");
        createUser("STU002", "Jane Smith", "password123", UserRole.STUDENT, Department.CCE, Year.SECOND, HostelType.G, "205", "9876543211");
        createUser("STU003", "Mike Johnson", "password123", UserRole.STUDENT, Department.AIML, Year.FOURTH, HostelType.DAYSCHOLAR, null, "9876543212");
        
        // Create sample advisors
        createUser("ADV001", "Dr. Sarah Wilson", "password123", UserRole.ADVISOR, Department.CSE, null, null, null, null);
        createUser("ADV002", "Dr. Robert Brown", "password123", UserRole.ADVISOR, Department.CCE, null, null, null, null);
        createUser("ADV003", "Dr. Emily Davis", "password123", UserRole.ADVISOR, Department.AIML, null, null, null, null);
        
        // Create sample HODs
        createUser("HOD001", "Dr. Michael Chen", "password123", UserRole.HOD, Department.CSE, null, null, null, null);
        createUser("HOD002", "Dr. Lisa Anderson", "password123", UserRole.HOD, Department.CCE, null, null, null, null);
        createUser("HOD003", "Dr. David Miller", "password123", UserRole.HOD, Department.AIML, null, null, null, null);
        
        // Create principal
        createUser("PRIN001", "Dr. James Thompson", "password123", UserRole.PRINCIPAL, null, null, null, null, null);
        
        // Create wardens
        createUser("WAR001", "Dr. Mary Johnson", "password123", UserRole.WARDEN, null, null, HostelType.BH1, null, null);
        createUser("WAR002", "Dr. Patricia Williams", "password123", UserRole.WARDEN, null, null, HostelType.G, null, null);
        
        // Create deputy wardens
        createUser("DWAR001", "Dr. Jennifer Garcia", "password123", UserRole.DEPUTY_WARDEN, null, null, HostelType.BH1, null, null);
        createUser("DWAR002", "Dr. Linda Martinez", "password123", UserRole.DEPUTY_WARDEN, null, null, HostelType.G, null, null);
        
        // Create security personnel
        createUser("SEC001", "Security Guard 1", "password123", UserRole.SECURITY, null, null, null, null, null);
        createUser("SEC002", "Security Guard 2", "password123", UserRole.SECURITY, null, null, null, null, null);
    }
    
    private void createUser(String rollNo, String name, String password, UserRole role, Department department, Year year, HostelType hostel, String roomNo, String parentPhone) {
        User user = new User();
        user.setRollNo(rollNo);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setDepartment(department);
        user.setYear(year);
        user.setHostel(hostel);
        user.setRoomNo(roomNo);
        user.setParentPhone(parentPhone);
        
        userRepository.save(user);
    }
}