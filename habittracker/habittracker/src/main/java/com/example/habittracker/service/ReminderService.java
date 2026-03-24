package com.example.habittracker.service;

import com.example.habittracker.model.Reminder;
import com.example.habittracker.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;

    public ReminderService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public Optional<Reminder> getReminderById(Long id) {
        return reminderRepository.findById(id);
    }

    public Reminder saveReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    public Reminder updateReminder(Long id, Reminder reminderDetails) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(() -> new RuntimeException("Reminder not found"));
        reminder.setNotification(reminderDetails.getNotification());
        reminder.setFrequency(reminderDetails.getFrequency());
        reminder.setTask(reminderDetails.getTask());
        return reminderRepository.save(reminder);
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }
}