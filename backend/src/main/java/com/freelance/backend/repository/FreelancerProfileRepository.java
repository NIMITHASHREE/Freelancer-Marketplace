package com.freelance.backend.repository;

import com.freelance.backend.model.FreelancerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Integer> {

    @Query("SELECT f FROM FreelancerProfile f WHERE f.user.userId = :userId")
    Optional<FreelancerProfile> findByUserId(@Param("userId") Integer userId);
}