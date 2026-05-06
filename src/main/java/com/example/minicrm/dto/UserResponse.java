package com.example.minicrm.dto;

import com.example.minicrm.entity.UserRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role
) {
}
