package com.example.habittracker.controller;

import com.example.habittracker.model.Habit;
import com.example.habittracker.model.Task;
import com.example.habittracker.service.HabitService;
import com.example.habittracker.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService  taskService;
    private final HabitService habitService;

    public TaskController(TaskService taskService, HabitService habitService) {
        this.taskService  = taskService;
        this.habitService = habitService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/habit/{habitId}")
    public List<Task> getTasksByHabit(@PathVariable Long habitId) {
        return taskService.getTasksByHabitId(habitId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Map<String, Object> body) {
        Long habitId = Long.valueOf(body.get("habitId").toString());
        Habit habit  = habitService.getHabitById(habitId).orElse(null);
        if (habit == null) return ResponseEntity.notFound().build();

        Task task = new Task();
        task.setTitle(body.get("title").toString());
        task.setDescription(body.containsKey("description")
                ? body.get("description").toString() : "");
        task.setDueDate(LocalDate.parse(body.get("dueDate").toString()));
        task.setStatus("Not Done");
        task.setHabit(habit);

        return ResponseEntity.ok(taskService.saveTask(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                           @RequestBody Map<String, Object> body) {
        return taskService.getTaskById(id).map(task -> {
            if (body.containsKey("status")) task.setStatus(body.get("status").toString());
            return ResponseEntity.ok(taskService.saveTask(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully");
    }
}