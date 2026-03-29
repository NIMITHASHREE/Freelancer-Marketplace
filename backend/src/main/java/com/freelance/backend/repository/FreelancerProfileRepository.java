package com.freelance.backend.repository;


import com.freelance.backend.model.FreelancerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Integer> {
    Optional<FreelancerProfile> findByUserUserId(Integer userId);
}


