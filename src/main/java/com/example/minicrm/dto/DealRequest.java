package com.example.minicrm.dto;

import com.example.minicrm.entity.DealStage;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record DealRequest(
        @NotBlank @Size(max = 160) String name,
        @NotNull @DecimalMin(value = "0.00", inclusive = false) BigDecimal amount,
        @NotNull DealStage stage,
        @NotNull Long customerId,
        @NotNull Long ownerId
) {
}
