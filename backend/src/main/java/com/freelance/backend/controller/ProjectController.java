package com.freelance.backend.controller;


import com.freelance.backend.dto.*;
import com.freelance.backend.model.*;
import com.freelance.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;       // thin service to get userId from email

    @GetMapping("/open")
    public ResponseEntity<List<Project>> getOpenProjects() {
        return ResponseEntity.ok(projectService.getOpenProjects());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> search(@RequestParam String q) {
        return ResponseEntity.ok(projectService.searchProjects(q));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody ProjectRequest req, Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(projectService.createProject(userId, req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Project>> myProjects(Authentication auth) {
        Integer userId = userService.getUserIdByEmail(auth.getName());
        return ResponseEntity.ok(projectService.getClientProjects(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Integer id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }
}