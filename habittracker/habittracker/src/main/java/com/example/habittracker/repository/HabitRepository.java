package com.example.habittracker.repository;

import com.example.habittracker.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserUserId(Long userId);
}