package com.freelance.backend.dto;

import com.freelance.backend.model.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProjectRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private Project.BudgetType budgetType;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private LocalDate deadline;
    private Integer categoryId;
}