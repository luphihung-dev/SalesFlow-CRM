package com.example.minicrm.dto;

import com.example.minicrm.entity.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 180) String title,
        @NotNull @FutureOrPresent LocalDate dueDate,
        @NotNull TaskStatus status,
        Long userId,
        @NotNull Long customerId
) {
}
