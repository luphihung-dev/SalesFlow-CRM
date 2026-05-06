package com.example.minicrm.dto;

import com.example.minicrm.entity.UserRole;

public record LoginResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email,
        UserRole role
) {
}
