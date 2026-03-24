package com.example.habittracker.service;

import com.example.habittracker.model.History;
import com.example.habittracker.repository.HistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoryService {

    private final HistoryRepository historyRepository;

    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<History> getAllHistory() {
        return historyRepository.findAll();
    }

    public Optional<History> getHistoryById(Long id) {
        return historyRepository.findById(id);
    }

    public History saveHistory(History history) {
        return historyRepository.save(history);
    }

    public History updateHistory(Long id, History historyDetails) {
        History history = historyRepository.findById(id).orElseThrow(() -> new RuntimeException("History not found"));
        history.setDate(historyDetails.getDate());
        history.setStatus(historyDetails.getStatus());
        history.setTask(historyDetails.getTask());
        return historyRepository.save(history);
    }

    public void deleteHistory(Long id) {
        historyRepository.deleteById(id);
    }
}