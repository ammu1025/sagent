package com.example.habittracker.controller;

import com.example.habittracker.model.Habit;
import com.example.habittracker.model.User;
import com.example.habittracker.repository.UserRepository;
import com.example.habittracker.service.HabitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "http://localhost:3000")
public class HabitController {

    private final HabitService habitService;
    private final UserRepository userRepository;

    public HabitController(HabitService habitService, UserRepository userRepository) {
        this.habitService   = habitService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Habit> getAllHabits() {
        return habitService.getAllHabits();
    }

    @GetMapping("/user/{userId}")
    public List<Habit> getHabitsByUser(@PathVariable Long userId) {
        return habitService.getHabitsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabitById(@PathVariable Long id) {
        return habitService.getHabitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        Habit habit = new Habit();
        habit.setHabitName(body.get("habitName").toString());
        habit.setFrequency(body.get("frequency").toString());
        habit.setStatus("Not Completed");
        habit.setStreaks(0);
        habit.setUser(userOpt.get());

        return ResponseEntity.ok(habitService.saveHabit(habit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id,
                                             @RequestBody Map<String, Object> body) {
        return habitService.getHabitById(id).map(habit -> {
            if (body.containsKey("status"))  habit.setStatus(body.get("status").toString());
            if (body.containsKey("streaks")) habit.setStreaks(
                    Integer.parseInt(body.get("streaks").toString()));
            return ResponseEntity.ok(habitService.saveHabit(habit));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok("Habit deleted successfully");
    }
}