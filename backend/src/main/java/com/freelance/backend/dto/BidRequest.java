package com.freelance.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BidRequest {
    @NotNull
    private BigDecimal bidAmount;
    @NotNull
    @Min(1)
    private Integer timelineDays;
    private String proposal;
}

