package com.freelance.backend.model;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "freelancer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer freelancerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private BigDecimal hourlyRate;

    @Builder.Default
    private BigDecimal totalEarned = BigDecimal.ZERO;

    @Builder.Default
    private Integer jobsCompleted = 0;

    @Builder.Default
    private BigDecimal avgRating = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Availability availability = Availability.AVAILABLE;

    private String portfolioUrl;

    public enum Availability { AVAILABLE, BUSY, UNAVAILABLE }
}