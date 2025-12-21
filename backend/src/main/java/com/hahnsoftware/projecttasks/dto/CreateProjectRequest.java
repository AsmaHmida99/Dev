package com.hahnsoftware.projecttasks.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateProjectRequest {
    @NotBlank(message = "Project title is required")
    @Size(min = 1, max = 100, message = "Project title must be between 1 and 100 characters")
    private String title;

    @Size(max = 500, message = "Project description must not exceed 500 characters")
    private String description;

    public CreateProjectRequest() {
    }

    public CreateProjectRequest(String title, String description) {
        this.title = title;
        this.description = description;
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
}