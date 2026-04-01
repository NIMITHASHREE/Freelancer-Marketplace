package com.freelance.backend.repository;
import com.freelance.backend.model.SubRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SubRequirementRepository extends JpaRepository<SubRequirement, Integer> {
    List<SubRequirement> findByContractContractId(Integer contractId);
    List<SubRequirement> findByVisibility(SubRequirement.Visibility visibility);
    List<SubRequirement> findByProjectProjectId(Integer projectId);
}