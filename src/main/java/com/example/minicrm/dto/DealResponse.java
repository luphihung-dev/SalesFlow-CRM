package com.example.minicrm.dto;

import com.example.minicrm.entity.DealStage;
import java.math.BigDecimal;

public record DealResponse(
        Long id,
        String name,
        BigDecimal amount,
        DealStage stage,
        boolean requiresManagerApproval,
        Long customerId,
        String customerName,
        Long ownerId,
        String ownerName
) {
}
