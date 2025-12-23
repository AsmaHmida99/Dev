package com.hahnsoftware.projecttasks.dto;

import java.time.LocalDateTime;

public class ProjectResponseDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private int taskCount;
    private int completedTaskCount;

    public ProjectResponseDTO() {
    }

    public ProjectResponseDTO(Long id, String title, String description,
                              LocalDateTime createdAt, int taskCount, int completedTaskCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.taskCount = taskCount;
        this.completedTaskCount = completedTaskCount;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(int taskCount) {
        this.taskCount = taskCount;
    }

    public int getCompletedTaskCount() {
        return completedTaskCount;
    }

    public void setCompletedTaskCount(int completedTaskCount) {
        this.completedTaskCount = completedTaskCount;
    }
}