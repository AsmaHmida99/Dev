package com.hahnsoftware.projecttasks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hahnsoftware.projecttasks.repository")
public class ProjectTasksManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectTasksManagerApplication.class, args);
	}

}
