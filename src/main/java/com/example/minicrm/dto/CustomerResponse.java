package com.example.minicrm.dto;

import com.example.minicrm.entity.CustomerCountry;
import com.example.minicrm.entity.CustomerStatus;
import java.time.Instant;

public record CustomerResponse(
        Long id,
        String name,
        String email,
        String phone,
        CustomerCountry country,
        String company,
        CustomerStatus status,
        Instant createdAt,
        Long teamId,
        String teamName
) {
}
