package com.freelance.backend.repository;

import com.freelance.backend.model.SubReqBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SubReqBidRepository extends JpaRepository<SubReqBid, Integer> {

    List<SubReqBid> findBySubRequirementSubReqId(Integer subReqId);

    @Query("SELECT b FROM SubReqBid b WHERE b.freelancer.user.userId = :userId")
    List<SubReqBid> findByFreelancerUserId(@Param("userId") Integer userId);
}