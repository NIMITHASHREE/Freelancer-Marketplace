package com.freelance.backend.model;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity @Table(name = "milestones")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Milestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "milestone_id") private Integer milestoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler","milestones"})
    private Contract contract;

    private String title;
    @Column(columnDefinition = "TEXT") private String description;
    private BigDecimal amount;
    @Column(name = "due_date") private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default private Status status = Status.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public enum Status { PENDING, SUBMITTED, APPROVED, REJECTED }
}