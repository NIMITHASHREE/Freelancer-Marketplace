package com.freelance.backend.repository;

import com.freelance.backend.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Integer> {
    List<Bid> findByProjectProjectId(Integer projectId);
    List<Bid> findByFreelancerFreelancerId(Integer freelancerId);
    Optional<Bid> findByProjectProjectIdAndFreelancerFreelancerId(
            Integer projectId, Integer freelancerId);
    boolean existsByProjectProjectIdAndFreelancerFreelancerId(
            Integer projectId, Integer freelancerId);
}

