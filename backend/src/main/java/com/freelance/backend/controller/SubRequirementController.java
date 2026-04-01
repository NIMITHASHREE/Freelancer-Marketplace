package com.freelance.backend.controller;

import com.freelance.backend.dto.*;
import com.freelance.backend.model.*;
import com.freelance.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class SubRequirementController {

    private final SubRequirementService subReqService;
    private final UserService userService;

    @GetMapping("/sub-requirements/public")
    public ResponseEntity<List<Map<String, Object>>> getPublic() {
        return ResponseEntity.ok(subReqService.getPublicSubRequirements());
    }

    @GetMapping("/contracts/{contractId}/sub-requirements")
    public ResponseEntity<List<SubRequirement>> getForContract(
            @PathVariable Integer contractId) {
        return ResponseEntity.ok(subReqService.getForContract(contractId));
    }

    @PostMapping("/contracts/{contractId}/sub-requirements")
    public ResponseEntity<SubRequirement> create(
            @PathVariable Integer contractId,
            @RequestBody SubRequirementRequest req,
            Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(subReqService.create(contractId, userId, req));
    }

    @PutMapping("/sub-requirements/{subReqId}/approve")
    public ResponseEntity<SubRequirement> approve(
            @PathVariable Integer subReqId,
            Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(subReqService.approve(subReqId, userId));
    }

    @GetMapping("/sub-requirements/{subReqId}/bids")
    public ResponseEntity<List<SubReqBid>> getBids(@PathVariable Integer subReqId) {
        return ResponseEntity.ok(subReqService.getBidsForSubReq(subReqId));
    }

    @PostMapping("/sub-requirements/{subReqId}/bids")
    public ResponseEntity<SubReqBid> placeBid(
            @PathVariable Integer subReqId,
            @RequestBody SubReqBidRequest req,
            Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(subReqService.placeBid(subReqId, userId, req));
    }

    @PutMapping("/sub-req-bids/{subBidId}/accept")
    public ResponseEntity<Contract> acceptBid(@PathVariable Integer subBidId) {
        return ResponseEntity.ok(subReqService.acceptBid(subBidId));
    }
}