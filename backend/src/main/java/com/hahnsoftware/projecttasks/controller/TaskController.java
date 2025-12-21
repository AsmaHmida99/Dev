package com.hahnsoftware.projecttasks.controller;

import com.hahnsoftware.projecttasks.dto.CreateTaskRequest;
import com.hahnsoftware.projecttasks.dto.UpdateTaskRequest;
import com.hahnsoftware.projecttasks.model.Project;
import com.hahnsoftware.projecttasks.model.Task;
import com.hahnsoftware.projecttasks.model.User;
import com.hahnsoftware.projecttasks.repository.ProjectRepository;
import com.hahnsoftware.projecttasks.repository.TaskRepository;
import com.hahnsoftware.projecttasks.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/projects/{projectId}/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable Long projectId) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        List<Task> tasks = taskRepository.findByProject(project);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Task> createTask(@PathVariable Long projectId, @Valid @RequestBody CreateTaskRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false);
        task.setProject(project);

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Task> getTaskById(@PathVariable Long projectId, @PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Vérifier que la tâche appartient au projet
        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }
        
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Task> updateTask(@PathVariable Long projectId, @PathVariable Long id, @Valid @RequestBody UpdateTaskRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Vérifier que la tâche appartient au projet
        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteTask(@PathVariable Long projectId, @PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Vérifier que la tâche appartient au projet
        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        taskRepository.delete(task);
        return ResponseEntity.ok().build();
    }
}