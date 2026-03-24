package com.example.habittracker.controller;

import com.example.habittracker.model.History;
import com.example.habittracker.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin("*")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<History> getAllHistory() {
        return historyService.getAllHistory();
    }

    @GetMapping("/{id}")
    public ResponseEntity<History> getHistoryById(@PathVariable Long id) {
        return historyService.getHistoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public History createHistory(@RequestBody History history) {
        return historyService.saveHistory(history);
    }

    @PutMapping("/{id}")
    public ResponseEntity<History> updateHistory(@PathVariable Long id, @RequestBody History history) {
        return ResponseEntity.ok(historyService.updateHistory(id, history));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHistory(@PathVariable Long id) {
        historyService.deleteHistory(id);
        return ResponseEntity.ok("History deleted successfully");
    }
}