package com.example.minicrm.dto;

import com.example.minicrm.entity.TaskStatus;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        LocalDate dueDate,
        TaskStatus status,
        boolean overdue,
        Long userId,
        String userName,
        Long customerId,
        String customerName
) {
}
