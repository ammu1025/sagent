package com.example.habittracker.service;

import com.example.habittracker.model.Habit;
import com.example.habittracker.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public List<Habit> getAllHabits() {
        return habitRepository.findAll();
    }

    public List<Habit> getHabitsByUserId(Long userId) {
        return habitRepository.findByUserUserId(userId);
    }

    public Optional<Habit> getHabitById(Long id) {
        return habitRepository.findById(id);
    }

    public Habit saveHabit(Habit habit) {
        return habitRepository.save(habit);
    }

    public Habit updateHabit(Long id, Habit habitDetails) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        habit.setHabitName(habitDetails.getHabitName());
        habit.setFrequency(habitDetails.getFrequency());
        habit.setStatus(habitDetails.getStatus());
        habit.setStreaks(habitDetails.getStreaks());
        return habitRepository.save(habit);
    }

    public void deleteHabit(Long id) {
        habitRepository.deleteById(id);
    }
}