package com.donation.server.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.donation.server.model.User;
import com.donation.server.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(
            UserRepository userRepository) {

        this.userRepository =
                userRepository;
    }

    // =========================
    // REGISTER
    // =========================

    public User registerUser(User user) {

        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        return userRepository.save(user);
    }

    // =========================
    // FIND BY EMAIL
    // =========================

    public Optional<User> findByEmail(
            String email) {

        return userRepository.findByEmail(
                email
        );
    }

    // =========================
    // FIND BY ID
    // =========================

    public Optional<User> findById(
            Long id) {

        return userRepository.findById(id);
    }

    // =========================
    // GOOGLE LOGIN
    // =========================

    public User googleLogin(User googleUser) {

        Optional<User> existingUser =
                userRepository.findByEmail(
                        googleUser.getEmail()
                );

        // =========================
        // EXISTING USER
        // =========================

        if (existingUser.isPresent()) {

            User user =
                    existingUser.get();

            // Update name if Google provides it
            if (googleUser.getName() != null &&
                    !googleUser.getName().isBlank()) {

                user.setName(
                        googleUser.getName()
                );
            }

            // Keep existing phone
            // Keep existing role
            // Keep existing createdAt

            return userRepository.save(user);
        }

        // =========================
        // NEW GOOGLE USER
        // =========================

        User newUser =
                new User();

        newUser.setName(
                googleUser.getName()
        );

        newUser.setEmail(
                googleUser.getEmail()
        );

        newUser.setPhone(
                googleUser.getPhone()
        );

        newUser.setRole(
                "Donor"
        );

        // Google users don't need
        // a local password
        newUser.setPassword(null);

        // @PrePersist in User.java
        // automatically sets createdAt

        return userRepository.save(
                newUser
        );
    }

    // =========================
    // UPDATE USER
    // =========================

    public User updateUser(
            Long id,
            User updatedUser) {

        Optional<User> existingUser =
                userRepository.findById(id);

        if (existingUser.isEmpty()) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        User user =
                existingUser.get();

        if (updatedUser.getName() != null &&
                !updatedUser.getName().isBlank()) {

            user.setName(
                    updatedUser.getName()
            );
        }

        if (updatedUser.getPhone() != null &&
                !updatedUser.getPhone().isBlank()) {

            user.setPhone(
                    updatedUser.getPhone()
            );
        }

        return userRepository.save(user);
    }
}