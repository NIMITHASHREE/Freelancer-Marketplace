package com.freelance.backend.repository;

import com.freelance.backend.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Optional<Contract> findByProjectProjectId(Integer projectId);
    Optional<Contract> findByBidBidId(Integer bidId);
}