package com.freelance.backend.service;


import com.freelance.backend.dto.ProjectRequest;
import com.freelance.backend.model.*;
import com.freelance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final ClientProfileRepository clientProfileRepo;
    private final CategoryRepository categoryRepo;  // add a simple CategoryRepository

    @Transactional
    public Project createProject(Integer userId, ProjectRequest req) {
        ClientProfile client = clientProfileRepo.findByUserUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found"));

        Category category = req.getCategoryId() != null
                ? categoryRepo.findById(req.getCategoryId()).orElse(null)
                : null;

        Project project = Project.builder()
                .client(client)
                .category(category)
                .title(req.getTitle())
                .description(req.getDescription())
                .budgetType(req.getBudgetType())
                .budgetMin(req.getBudgetMin())
                .budgetMax(req.getBudgetMax())
                .deadline(req.getDeadline())
                .status(Project.Status.OPEN)
                .build();

        project = projectRepo.save(project);

        // Update client stats
        client.setProjectsPosted(client.getProjectsPosted() + 1);
        clientProfileRepo.save(client);

        return project;
    }

    public List<Project> getOpenProjects() {
        return projectRepo.findByStatus(Project.Status.OPEN);
    }

    public List<Project> getClientProjects(Integer userId) {
        ClientProfile client = clientProfileRepo.findByUserUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));
        return projectRepo.findByClientClientId(client.getClientId());
    }

    public List<Project> searchProjects(String keyword) {
        return projectRepo.searchOpenProjects(keyword);
    }

    public Project getProjectById(Integer projectId) {
        return projectRepo.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }
}
