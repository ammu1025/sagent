package com.example.habittracker.service;

import com.example.habittracker.model.Task;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderSchedulerService {

    private final TaskService taskService;

    public ReminderSchedulerService(TaskService taskService) {
        this.taskService = taskService;
    }

    @Scheduled(fixedRate = 3600000)
    public void remindPendingTasks() {
        List<Task> tasks = taskService.getTasksByStatus("Not Done");
        for (Task task : tasks) {
            System.out.println("REMINDER: Task '"
                    + task.getTitle()
                    + "' is not done yet! Due: "
                    + task.getDueDate());
        }
    }
}