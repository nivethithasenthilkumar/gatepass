package com.college.gatepass.service;

import com.college.gatepass.model.User;
import com.college.gatepass.repository.UserRepository;
import com.college.gatepass.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    UserRepository userRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String rollNo) throws UsernameNotFoundException {
        User user = userRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with roll number: " + rollNo));
        
        return UserPrincipal.create(user);
    }
}