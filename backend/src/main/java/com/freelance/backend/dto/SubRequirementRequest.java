package com.freelance.backend.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubRequirementRequest {
    private String title;
    private String description;
    private Integer categoryId;
    private String skillsNeeded;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
}