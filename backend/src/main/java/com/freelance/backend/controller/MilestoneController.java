package com.freelance.backend.controller;

import com.freelance.backend.dto.MilestoneRequest;
import com.freelance.backend.model.Milestone;
import com.freelance.backend.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @GetMapping("/contracts/{contractId}/milestones")
    public ResponseEntity<List<Milestone>> getAll(@PathVariable Integer contractId) {
        return ResponseEntity.ok(milestoneService.getMilestonesForContract(contractId));
    }

    @PostMapping("/contracts/{contractId}/milestones")
    public ResponseEntity<Milestone> create(@PathVariable Integer contractId,
                                            @RequestBody MilestoneRequest req) {
        return ResponseEntity.ok(milestoneService.createMilestone(contractId, req));
    }

    @PutMapping("/milestones/{milestoneId}")
    public ResponseEntity<Milestone> update(@PathVariable Integer milestoneId,
                                            @RequestBody MilestoneRequest req) {
        return ResponseEntity.ok(milestoneService.updateMilestone(milestoneId, req));
    }

    @PutMapping("/milestones/{milestoneId}/submit")
    public ResponseEntity<Milestone> submit(@PathVariable Integer milestoneId) {
        return ResponseEntity.ok(milestoneService.submitMilestone(milestoneId));
    }

    @PutMapping("/milestones/{milestoneId}/approve")
    public ResponseEntity<Milestone> approve(@PathVariable Integer milestoneId) {
        return ResponseEntity.ok(milestoneService.approveMilestone(milestoneId));
    }

    @PutMapping("/milestones/{milestoneId}/reject")
    public ResponseEntity<Milestone> reject(@PathVariable Integer milestoneId) {
        return ResponseEntity.ok(milestoneService.rejectMilestone(milestoneId));
    }

    @DeleteMapping("/milestones/{milestoneId}")
    public ResponseEntity<Void> delete(@PathVariable Integer milestoneId) {
        milestoneService.deleteMilestone(milestoneId);
        return ResponseEntity.noContent().build();
    }
}