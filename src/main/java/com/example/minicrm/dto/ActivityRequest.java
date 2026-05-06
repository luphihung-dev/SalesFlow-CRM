package com.example.minicrm.dto;

import com.example.minicrm.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ActivityRequest(
        @NotNull ActivityType type,
        @NotBlank @Size(max = 5000) String description,
        @NotNull Long customerId
) {
}
