package com.freelance.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity @Table(name = "sub_req_bids")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SubReqBid {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_bid_id") private Integer subBidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_req_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private SubRequirement subRequirement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler","bids"})
    private FreelancerProfile freelancer;

    @Column(name = "bid_amount") private BigDecimal bidAmount;
    @Column(columnDefinition = "TEXT") private String proposal;
    @Column(name = "delivery_days") private Integer deliveryDays;

    @Enumerated(EnumType.STRING)
    @Builder.Default private Status status = Status.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public enum Status { PENDING, ACCEPTED, REJECTED }
}