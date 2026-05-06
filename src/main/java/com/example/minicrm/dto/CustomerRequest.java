package com.example.minicrm.dto;

import com.example.minicrm.entity.CustomerCountry;
import com.example.minicrm.entity.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank @Size(max = 140) String name,
        @NotBlank @Email @Size(max = 160) String email,
        @Size(max = 40) @Pattern(regexp = "^[+0-9() .-]*$", message = "must be a valid phone number") String phone,
        @NotNull CustomerCountry country,
        @Size(max = 160) String company,
        @NotNull CustomerStatus status
) {
}
