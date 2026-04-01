package com.freelance.backend.service;

import com.freelance.backend.dto.*;
import com.freelance.backend.model.*;
import com.freelance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service @RequiredArgsConstructor
public class SubRequirementService {

    private final SubRequirementRepository subReqRepo;
    private final SubReqBidRepository subReqBidRepo;
    private final ContractRepository contractRepo;
    private final CategoryRepository categoryRepo;
    private final FreelancerProfileRepository freelancerRepo;
    private final MilestoneRepository milestoneRepo;
    private final UserRepository userRepo;

    public List<Map<String, Object>> getPublicSubRequirements() {
        List<SubRequirement> list = subReqRepo.findByVisibility(SubRequirement.Visibility.PUBLIC);
        return list.stream().map(sr -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("subReqId",       sr.getSubReqId());
            map.put("title",          sr.getTitle());
            map.put("description",    sr.getDescription());
            map.put("category",       sr.getCategory());
            map.put("skillsNeeded",   sr.getSkillsNeeded());
            map.put("budgetMin",      sr.getBudgetMin());
            map.put("budgetMax",      sr.getBudgetMax());
            map.put("project",        Map.of("title",
                    sr.getProject().getTitle(),
                    "projectId", sr.getProject().getProjectId()));
            map.put("progressPercent", getProgressPercent(sr.getContract().getContractId()));
            map.put("initiatedBy",    sr.getInitiatedBy());
            map.put("approvalStatus", sr.getApprovalStatus());
            map.put("visibility",     sr.getVisibility());
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    public List<SubRequirement> getForContract(Integer contractId) {
        return subReqRepo.findByContractContractId(contractId);
    }

    @Transactional
    public SubRequirement create(Integer contractId, Integer initiatorUserId,
                                 SubRequirementRequest req) {
        Contract contract = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        Category category = req.getCategoryId() != null
                ? categoryRepo.findById(req.getCategoryId()).orElse(null) : null;

        SubRequirement sr = SubRequirement.builder()
                .contract(contract)
                .project(contract.getProject())
                .initiatedBy(initiatorUserId)
                .title(req.getTitle())
                .description(req.getDescription())
                .category(category)
                .skillsNeeded(req.getSkillsNeeded())
                .budgetMin(req.getBudgetMin())
                .budgetMax(req.getBudgetMax())
                .approvalStatus(SubRequirement.ApprovalStatus.PENDING_APPROVAL)
                .visibility(SubRequirement.Visibility.PRIVATE)
                .build();
        return subReqRepo.save(sr);
    }

    @Transactional
    public SubRequirement approve(Integer subReqId, Integer approverUserId) {
        SubRequirement sr = subReqRepo.findById(subReqId)
                .orElseThrow(() -> new RuntimeException("Sub-requirement not found"));
        // Ensure approver is NOT the initiator
        if (sr.getInitiatedBy().equals(approverUserId)) {
            throw new RuntimeException("Initiator cannot approve their own request");
        }
        sr.setApprovalStatus(SubRequirement.ApprovalStatus.APPROVED);
        sr.setApprovedBy(approverUserId);
        sr.setVisibility(SubRequirement.Visibility.PUBLIC);
        return subReqRepo.save(sr);
    }

    public int getProgressPercent(Integer contractId) {
        List<Milestone> milestones = milestoneRepo.findByContractContractId(contractId);
        if (milestones.isEmpty()) return 0;
        long approved = milestones.stream()
                .filter(m -> m.getStatus() == Milestone.Status.APPROVED).count();
        return (int) (approved * 100 / milestones.size());
    }

    @Transactional
    public SubReqBid placeBid(Integer subReqId, Integer freelancerUserId,
                              SubReqBidRequest req) {
        SubRequirement sr = subReqRepo.findById(subReqId)
                .orElseThrow(() -> new RuntimeException("Sub-requirement not found"));
        FreelancerProfile fp = freelancerRepo.findByUserId(freelancerUserId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));
        SubReqBid bid = SubReqBid.builder()
                .subRequirement(sr)
                .freelancer(fp)
                .bidAmount(req.getBidAmount())
                .proposal(req.getProposal())
                .deliveryDays(req.getDeliveryDays())
                .build();
        return subReqBidRepo.save(bid);
    }

    @Transactional
    public Contract acceptBid(Integer subBidId) {
        SubReqBid bid = subReqBidRepo.findById(subBidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));
        bid.setStatus(SubReqBid.Status.ACCEPTED);
        subReqBidRepo.save(bid);

        // Reject other bids
        List<SubReqBid> others = subReqBidRepo
                .findBySubRequirementSubReqId(bid.getSubRequirement().getSubReqId());
        for (SubReqBid other : others) {
            if (!other.getSubBidId().equals(subBidId)
                    && other.getStatus() == SubReqBid.Status.PENDING) {
                other.setStatus(SubReqBid.Status.REJECTED);
                subReqBidRepo.save(other);
            }
        }

        // Create new contract for this freelancer on same project
        SubRequirement sr = bid.getSubRequirement();
        BigDecimal total = bid.getBidAmount();
        BigDecimal fee   = total.multiply(BigDecimal.valueOf(0.10));

        Contract newContract = Contract.builder()
                .project(sr.getProject())
                .bid(null)
                .client(sr.getContract().getClient())
                .freelancer(bid.getFreelancer())
                .totalAmount(total)
                .platformFee(fee)
                .startDate(java.time.LocalDate.now())
                .status(Contract.Status.ACTIVE)
                .build();

        return contractRepo.save(newContract);
    }

    public List<SubReqBid> getBidsForSubReq(Integer subReqId) {
        return subReqBidRepo.findBySubRequirementSubReqId(subReqId);
    }
}