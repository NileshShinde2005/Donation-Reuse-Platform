package com.donation.server.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donation.server.model.User;
import com.donation.server.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService) {

        this.userService =
                userService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        try {

            User savedUser =
                    userService.registerUser(user);

            // Don't return password
            savedUser.setPassword(null);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================
    // NORMAL LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginUser) {

        Optional<User> existingUser =
                userService.findByEmail(
                        loginUser.getEmail()
                );

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid email or password"
                    );
        }

        User user =
                existingUser.get();

        // Google-created users have no password
        if (user.getPassword() == null ||
                !user.getPassword().equals(
                        loginUser.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid email or password"
                    );
        }

        // Don't return password
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    // =========================
    // GOOGLE LOGIN
    // =========================

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(
            @RequestBody User googleUser) {

        try {

            if (googleUser.getEmail() == null ||
                    googleUser.getEmail().isBlank()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Google email is required"
                        );
            }

            User user =
                    userService.googleLogin(
                            googleUser
                    );

            // Don't return password
            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================
    // GET USER BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id) {

        Optional<User> existingUser =
                userService.findById(id);

        if (existingUser.isPresent()) {

            User user =
                    existingUser.get();

            // Don't send password
            user.setPassword(null);

            return ResponseEntity.ok(user);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("User not found");
    }

    // =========================
    // UPDATE USER
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        try {

            User user =
                    userService.updateUser(
                            id,
                            updatedUser
                    );

            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}