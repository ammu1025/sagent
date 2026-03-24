package com.example.habittracker.repository;

import com.example.habittracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByHabitHabitId(Long habitId);
    List<Task> findByStatus(String status);
}