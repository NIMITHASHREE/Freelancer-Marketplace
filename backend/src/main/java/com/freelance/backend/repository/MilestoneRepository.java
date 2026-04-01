package com.freelance.backend.repository;
import com.freelance.backend.model.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MilestoneRepository extends JpaRepository<Milestone, Integer> {
    List<Milestone> findByContractContractId(Integer contractId);
}