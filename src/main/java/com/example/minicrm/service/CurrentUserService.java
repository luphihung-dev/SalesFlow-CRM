package com.example.minicrm.service;

import com.example.minicrm.entity.User;
import com.example.minicrm.entity.UserRole;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication == null ? null : authentication.getName();
        if (email == null) {
            throw new ResourceNotFoundException("Authenticated user not found");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found with email: " + email));
    }

    public boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN;
    }

    public boolean isManager(User user) {
        return user.getRole() == UserRole.MANAGER;
    }

    public boolean isSales(User user) {
        return user.getRole() == UserRole.SALES;
    }
}
