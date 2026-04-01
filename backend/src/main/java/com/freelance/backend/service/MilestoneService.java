package com.freelance.backend.service;

import com.freelance.backend.dto.MilestoneRequest;
import com.freelance.backend.model.*;
import com.freelance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepo;
    private final ContractRepository contractRepo;

    public List<Milestone> getMilestonesForContract(Integer contractId) {
        return milestoneRepo.findByContractContractId(contractId);
    }

    @Transactional
    public Milestone createMilestone(Integer contractId, MilestoneRequest req) {
        Contract contract = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        Milestone m = Milestone.builder()
                .contract(contract)
                .title(req.getTitle())
                .description(req.getDescription())
                .amount(req.getAmount())
                .dueDate(req.getDueDate())
                .status(Milestone.Status.PENDING)
                .build();
        return milestoneRepo.save(m);
    }

    @Transactional
    public Milestone submitMilestone(Integer milestoneId) {
        Milestone m = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        m.setStatus(Milestone.Status.SUBMITTED);
        return milestoneRepo.save(m);
    }

    @Transactional
    public Milestone updateMilestone(Integer milestoneId, MilestoneRequest req) {
        Milestone m = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        if (req.getTitle() != null)       m.setTitle(req.getTitle());
        if (req.getDescription() != null) m.setDescription(req.getDescription());
        if (req.getAmount() != null)      m.setAmount(req.getAmount());
        if (req.getDueDate() != null)     m.setDueDate(req.getDueDate());
        return milestoneRepo.save(m);
    }

    @Transactional
    public Milestone approveMilestone(Integer milestoneId) {
        Milestone m = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        m.setStatus(Milestone.Status.APPROVED);
        return milestoneRepo.save(m);
    }

    @Transactional
    public Milestone rejectMilestone(Integer milestoneId) {
        Milestone m = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        m.setStatus(Milestone.Status.PENDING);
        return milestoneRepo.save(m);
    }

    @Transactional
    public void deleteMilestone(Integer milestoneId) {
        milestoneRepo.deleteById(milestoneId);
    }
}