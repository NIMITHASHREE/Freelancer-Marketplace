package com.freelance.backend.controller;


import com.freelance.backend.dto.BidRequest;
import com.freelance.backend.model.*;
import com.freelance.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;
    private final UserService userService;

    @PostMapping("/projects/{projectId}/bids")
    public ResponseEntity<Bid> placeBid(
            @PathVariable Integer projectId,
            @Valid @RequestBody BidRequest req,
            Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(bidService.placeBid(userId, projectId, req));
    }

    @GetMapping("/projects/{projectId}/bids")
    public ResponseEntity<List<Bid>> getBidsForProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(bidService.getBidsForProject(projectId));
    }

    @GetMapping("/bids/my")
    public ResponseEntity<List<Bid>> myBids(Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(bidService.getFreelancerBids(userId));
    }

    @PutMapping("/bids/{bidId}/accept")
    public ResponseEntity<Contract> acceptBid(@PathVariable Integer bidId) {
        return ResponseEntity.ok(bidService.acceptBid(bidId));
    }
}
