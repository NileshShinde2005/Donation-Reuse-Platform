package com.donation.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.donation.server.model.Request;
import com.donation.server.service.RequestService;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    // =========================
    // CREATE REQUEST
    // =========================

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody Request request) {

        try {

            Request savedRequest =
                    requestService.createRequest(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedRequest);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    // =========================
    // GET ALL REQUESTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {

        return ResponseEntity.ok(
                requestService.getAllRequests()
        );
    }

    // =========================
    // GET REQUEST BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(
            @PathVariable Long id) {

        var request =
                requestService.getRequestById(id);

        if (request.isPresent()) {

            return ResponseEntity.ok(
                    request.get()
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Request not found");
    }

    // =========================
    // GET MY REQUESTS
    // =========================

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Request>> getRequestsByUser(
            @PathVariable String email) {

        return ResponseEntity.ok(
                requestService.getRequestsByUser(email)
        );
    }

    // =========================
    // GET INCOMING REQUESTS
    // =========================

    @GetMapping("/donor/{email}")
    public ResponseEntity<List<Request>> getIncomingRequests(
            @PathVariable String email) {

        return ResponseEntity.ok(
                requestService.getIncomingRequests(email)
        );
    }

    // =========================
    // UPDATE REQUEST STATUS
    // =========================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        var request =
                requestService.updateStatus(
                        id,
                        status
                );

        if (request.isPresent()) {

            return ResponseEntity.ok(
                    request.get()
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Request not found");
    }

    // =========================
    // DELETE REQUEST
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(
            @PathVariable Long id) {

        if (requestService
                .getRequestById(id)
                .isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Request not found");
        }

        requestService.deleteRequest(id);

        return ResponseEntity.ok(
                "Request deleted successfully"
        );
    }
}