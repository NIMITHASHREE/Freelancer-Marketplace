package com.freelance.backend.service;


import com.freelance.backend.dto.BidRequest;
import com.freelance.backend.model.*;
import com.freelance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepo;
    private final ProjectRepository projectRepo;
    private final FreelancerProfileRepository freelancerProfileRepo;
    private final ContractRepository contractRepo;    // add simple ContractRepository

    @Transactional
    public Bid placeBid(Integer userId, Integer projectId, BidRequest req) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (project.getStatus() != Project.Status.OPEN) {
            throw new IllegalStateException("Project is not open for bidding");
        }

        FreelancerProfile freelancer = freelancerProfileRepo.findByUserUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer profile not found"));

        if (bidRepo.existsByProjectProjectIdAndFreelancerFreelancerId(
                projectId, freelancer.getFreelancerId())) {
            throw new IllegalStateException("You have already placed a bid on this project");
        }

        Bid bid = Bid.builder()
                .project(project)
                .freelancer(freelancer)
                .bidAmount(req.getBidAmount())
                .timelineDays(req.getTimelineDays())
                .proposal(req.getProposal())
                .status(Bid.Status.PENDING)
                .build();

        return bidRepo.save(bid);
    }

    public List<Bid> getBidsForProject(Integer projectId) {
        return bidRepo.findByProjectProjectId(projectId);
    }

    public List<Bid> getFreelancerBids(Integer userId) {
        FreelancerProfile freelancer = freelancerProfileRepo.findByUserUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found"));
        return bidRepo.findByFreelancerFreelancerId(freelancer.getFreelancerId());
    }

    @Transactional
    public Contract acceptBid(Integer bidId) {
        Bid bid = bidRepo.findById(bidId)
                .orElseThrow(() -> new IllegalArgumentException("Bid not found"));

        Project project = bid.getProject();
        if (project.getStatus() != Project.Status.OPEN) {
            throw new IllegalStateException("Project is not open");
        }

        // Accept this bid
        bid.setStatus(Bid.Status.ACCEPTED);
        bidRepo.save(bid);

        // Reject all other pending bids (replaces the dropped trigger)
        List<Bid> otherBids = bidRepo.findByProjectProjectId(project.getProjectId());
        for (Bid otherBid : otherBids) {
            if (!otherBid.getBidId().equals(bidId) &&
                    otherBid.getStatus() == Bid.Status.PENDING) {
                otherBid.setStatus(Bid.Status.REJECTED);
                bidRepo.save(otherBid);
            }
        }

        // Update project status
        project.setStatus(Project.Status.IN_PROGRESS);
        projectRepo.save(project);

        // Create contract
        BigDecimal total = bid.getBidAmount();
        BigDecimal fee = total.multiply(BigDecimal.valueOf(0.10));

        Contract contract = Contract.builder()
                .project(project)
                .bid(bid)
                .client(project.getClient())
                .freelancer(bid.getFreelancer())
                .totalAmount(total)
                .platformFee(fee)
                .startDate(java.time.LocalDate.now())
                .status(Contract.Status.ACTIVE)
                .build();

        return contractRepo.save(contract);
    }
}
