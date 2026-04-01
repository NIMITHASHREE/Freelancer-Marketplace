package com.freelance.backend.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubReqBidRequest {
    private BigDecimal bidAmount;
    private String proposal;
    private Integer deliveryDays;
}