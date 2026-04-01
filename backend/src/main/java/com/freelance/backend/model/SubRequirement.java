package com.freelance.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity @Table(name = "sub_requirements")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SubRequirement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_req_id") private Integer subReqId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler","client","category"})
    private Project project;

    @Column(name = "initiated_by") private Integer initiatedBy;
    private String title;
    @Column(columnDefinition = "TEXT") private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Category category;

    @Column(name = "skills_needed") private String skillsNeeded;
    @Column(name = "budget_min") private BigDecimal budgetMin;
    @Column(name = "budget_max") private BigDecimal budgetMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    @Builder.Default private ApprovalStatus approvalStatus = ApprovalStatus.PENDING_APPROVAL;

    @Column(name = "approved_by") private Integer approvedBy;

    @Enumerated(EnumType.STRING)
    @Builder.Default private Visibility visibility = Visibility.PRIVATE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public enum ApprovalStatus { PENDING_APPROVAL, APPROVED, REJECTED }
    public enum Visibility { PRIVATE, PUBLIC }
}