package com.example.minicrm.repository;

import com.example.minicrm.entity.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCustomerTeamId(Long teamId);
    List<Task> findByUserId(Long userId);
}
