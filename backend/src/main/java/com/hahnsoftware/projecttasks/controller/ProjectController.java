package com.hahnsoftware.projecttasks.controller;

import com.hahnsoftware.projecttasks.dto.CreateProjectRequest;
import com.hahnsoftware.projecttasks.dto.ProjectResponseDTO;
import com.hahnsoftware.projecttasks.dto.UpdateProjectRequest;
import com.hahnsoftware.projecttasks.model.Project;
import com.hahnsoftware.projecttasks.model.User;
import com.hahnsoftware.projecttasks.repository.ProjectRepository;
import com.hahnsoftware.projecttasks.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectController(ProjectRepository projectRepository,
                             UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    @GetMapping
    @Transactional
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjects() {
        User currentUser = userService.getCurrentUser();
        List<Project> projects = projectRepository.findByUser(currentUser);
        List<ProjectResponseDTO> projectDTOs = projects.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ProjectResponseDTO> createProject(@Valid @RequestBody CreateProjectRequest request) {
        User currentUser = userService.getCurrentUser();

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(currentUser);

        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(mapToDTO(savedProject));
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        return ResponseEntity.ok(mapToDTO(project));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ProjectResponseDTO> updateProject(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateProjectRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(mapToDTO(updatedProject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        projectRepository.delete(project);
        return ResponseEntity.ok().build();
    }

    private ProjectResponseDTO mapToDTO(Project project) {
        int taskCount = project.getTasks() != null ? project.getTasks().size() : 0;
        int completedTaskCount = project.getTasks() != null ?
                (int) project.getTasks().stream().filter(task -> Boolean.TRUE.equals(task.getCompleted())).count() : 0;

        return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getCreatedAt(),
                taskCount,
                completedTaskCount
        );
    }
}