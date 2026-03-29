package com.freelance.backend.dto;


import com.freelance.backend.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull
    private User.Role role;      // CLIENT or FREELANCER

    // Optional – only used when role = CLIENT
    private String companyName;
    private String industry;

    // Optional – only used when role = FREELANCER
    private String bio;
    private Double hourlyRate;
}

