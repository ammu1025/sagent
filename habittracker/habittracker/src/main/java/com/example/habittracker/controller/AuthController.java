package com.example.habittracker.controller;

import com.example.habittracker.model.User;
import com.example.habittracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        Map<String, Object> res = new HashMap<>();
        String name     = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");

        if (userRepository.existsByName(name)) {
            res.put("success", false);
            res.put("message", "Username already exists.");
            return ResponseEntity.badRequest().body(res);
        }
        if (userRepository.existsByEmail(email)) {
            res.put("success", false);
            res.put("message", "Email already registered.");
            return ResponseEntity.badRequest().body(res);
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        User saved = userRepository.save(user);

        res.put("success",  true);
        res.put("userId",   saved.getUserId());
        res.put("username", saved.getName());
        res.put("email",    saved.getEmail());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        Map<String, Object> res = new HashMap<>();
        String name     = body.get("username");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByName(name);

        if (userOpt.isEmpty()) {
            res.put("success", false);
            res.put("message", "No account found. Please Sign Up first.");
            return ResponseEntity.status(401).body(res);
        }
        if (!userOpt.get().getPassword().equals(password)) {
            res.put("success", false);
            res.put("message", "Incorrect password. Try again.");
            return ResponseEntity.status(401).body(res);
        }

        User user = userOpt.get();
        res.put("success",  true);
        res.put("userId",   user.getUserId());
        res.put("username", user.getName());
        res.put("email",    user.getEmail());
        return ResponseEntity.ok(res);
    }
}