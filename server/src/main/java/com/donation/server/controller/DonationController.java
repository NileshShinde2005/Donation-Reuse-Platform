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
import org.springframework.web.bind.annotation.RestController;

import com.donation.server.model.Donation;
import com.donation.server.service.DonationService;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    private final DonationService donationService;

    public DonationController(
            DonationService donationService) {

        this.donationService =
                donationService;
    }

    // =========================
    // CREATE DONATION
    // =========================

    @PostMapping
    public ResponseEntity<Donation> createDonation(
            @RequestBody Donation donation) {

        Donation savedDonation =
                donationService.createDonation(
                        donation
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDonation);
    }

    // =========================
    // GET ALL DONATIONS
    // =========================

    @GetMapping
    public ResponseEntity<List<Donation>>
    getAllDonations() {

        return ResponseEntity.ok(
                donationService.getAllDonations()
        );
    }

    // =========================
    // GET DONATION BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getDonationById(
            @PathVariable Long id) {

        return donationService
                .getDonationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .status(
                                        HttpStatus.NOT_FOUND
                                )
                                .body(null)
                );
    }

    // =========================
    // GET USER'S DONATIONS
    // =========================

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Donation>>
    getDonationsByUser(
            @PathVariable String email) {

        return ResponseEntity.ok(
                donationService
                        .getDonationsByUser(email)
        );
    }

    // =========================
    // UPDATE DONATION
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonation(
            @PathVariable Long id,
            @RequestBody Donation donation) {

        try {

            Donation updatedDonation =
                    donationService.updateDonation(
                            id,
                            donation
                    );

            return ResponseEntity.ok(
                    updatedDonation
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================
    // DELETE DONATION
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(
            @PathVariable Long id) {

        if (donationService
                .getDonationById(id)
                .isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Donation not found");
        }

        donationService.deleteDonation(id);

        return ResponseEntity.ok(
                "Donation deleted successfully"
        );
    }
}