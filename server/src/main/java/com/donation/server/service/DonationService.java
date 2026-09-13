package com.donation.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.donation.server.model.Donation;
import com.donation.server.repository.DonationRepository;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(
            DonationRepository donationRepository) {

        this.donationRepository =
                donationRepository;
    }

    // =========================
    // CREATE DONATION
    // =========================

    public Donation createDonation(Donation donation) {

    if (donation.getStatus() == null ||
            donation.getStatus().isBlank()) {

        donation.setStatus("AVAILABLE");
    }

    return donationRepository.save(donation);
}

    // =========================
    // GET ALL DONATIONS
    // =========================

    public List<Donation> getAllDonations() {

        return donationRepository.findAll();
    }

    // =========================
    // GET DONATION BY ID
    // =========================

    public Optional<Donation> getDonationById(
            Long id) {

        return donationRepository.findById(id);
    }

    // =========================
    // GET USER'S DONATIONS
    // =========================

    public List<Donation> getDonationsByUser(
            String email) {

        return donationRepository
                .findByDonatedBy(email);
    }

    // =========================
    // UPDATE DONATION
    // =========================

    public Donation updateDonation(
            Long id,
            Donation updatedDonation) {

        Optional<Donation> existingDonation =
                donationRepository.findById(id);

        if (existingDonation.isEmpty()) {

            throw new RuntimeException(
                    "Donation not found"
            );
        }

        Donation donation =
                existingDonation.get();

        // Update editable fields

        donation.setTitle(
                updatedDonation.getTitle()
        );

        donation.setCategory(
                updatedDonation.getCategory()
        );

        donation.setItemCondition(
                updatedDonation.getItemCondition()
        );

        donation.setLocation(
                updatedDonation.getLocation()
        );

        donation.setDescription(
                updatedDonation.getDescription()
        );

        donation.setPickup(
                updatedDonation.isPickup()
        );

        // Update image only if a new image
        // was provided

        if (updatedDonation.getImage() != null &&
                !updatedDonation.getImage().isBlank()) {

            donation.setImage(
                    updatedDonation.getImage()
            );
        }

        return donationRepository.save(
                donation
        );
    }

    // =========================
    // DELETE DONATION
    // =========================

    public void deleteDonation(Long id) {

        donationRepository.deleteById(id);
    }
}