package com.freelance.backend.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MilestoneRequest {
    private String title;
    private String description;
    private BigDecimal amount;
    private LocalDate dueDate;
}
