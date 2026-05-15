package com.college.gatepass.controller;

import com.college.gatepass.dto.LoginRequest;
import com.college.gatepass.dto.LoginResponse;
import com.college.gatepass.dto.RegisterRequest;
import com.college.gatepass.model.User;
import com.college.gatepass.security.JwtUtils;
import com.college.gatepass.security.UserPrincipal;
import com.college.gatepass.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserService userService;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getRollNo(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findByRollNo(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            LoginResponse response = new LoginResponse(jwt, user.getId(), user.getRollNo(), user.getName(), user.getRole());
            response.setDepartment(user.getDepartment());
            response.setYear(user.getYear());
            response.setHostel(user.getHostel());
            response.setRoomNo(user.getRoomNo());
            response.setParentPhone(user.getParentPhone());
            response.setFloorNo(user.getFloorNo());
            response.setPhoto(user.getPhoto());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: Invalid credentials!");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(registerRequest);
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Registration failed!");
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("User logged out successfully!");
    }
}