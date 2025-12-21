package com.hahnsoftware.projecttasks.repository;

import com.hahnsoftware.projecttasks.model.Project;
import com.hahnsoftware.projecttasks.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser(User user);
}