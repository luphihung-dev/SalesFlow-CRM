package com.example.minicrm.dto;

import com.example.minicrm.entity.ActivityType;
import java.time.Instant;

public record ActivityResponse(
        Long id,
        ActivityType type,
        String description,
        Instant createdAt,
        Long customerId,
        String customerName
) {
}
