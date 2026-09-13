package com.donation.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.donation.server.model.Donation;
import com.donation.server.model.Request;
import com.donation.server.repository.DonationRepository;
import com.donation.server.repository.RequestRepository;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final DonationRepository donationRepository;

    public RequestService(
            RequestRepository requestRepository,
            DonationRepository donationRepository) {

        this.requestRepository = requestRepository;
        this.donationRepository = donationRepository;
    }

    // =========================
    // CREATE REQUEST
    // =========================

    public Request createRequest(Request request) {

        boolean alreadyExists =
                requestRepository.existsByDonationIdAndRequestedBy(
                        request.getDonationId(),
                        request.getRequestedBy()
                );

        if (alreadyExists) {
            throw new RuntimeException(
                    "You have already requested this donation."
            );
        }

        if (request.getStatus() == null ||
                request.getStatus().isBlank()) {

            request.setStatus("Pending");
        }

        // =========================
        // UPDATE DONATION STATUS
        // =========================

        Optional<Donation> donation =
                donationRepository.findById(
                        request.getDonationId()
                );

        if (donation.isPresent()) {

            Donation existingDonation =
                    donation.get();

            if ("AVAILABLE".equalsIgnoreCase(
                    existingDonation.getStatus())) {

                existingDonation.setStatus(
                        "REQUESTED"
                );

                donationRepository.save(
                        existingDonation
                );
            }
        }

        return requestRepository.save(request);
    }

    // =========================
    // GET ALL REQUESTS
    // =========================

    public List<Request> getAllRequests() {

        return requestRepository.findAll();
    }

    // =========================
    // GET REQUEST BY ID
    // =========================

    public Optional<Request> getRequestById(
            Long id) {

        return requestRepository.findById(id);
    }

    // =========================
    // GET USER REQUESTS
    // =========================

    public List<Request> getRequestsByUser(
            String email) {

        return requestRepository.findByRequestedBy(
                email
        );
    }

    // =========================
    // GET DONOR REQUESTS
    // =========================

    public List<Request> getIncomingRequests(
            String donorEmail) {

        return requestRepository.findByDonorEmail(
                donorEmail
        );
    }

    // =========================
    // UPDATE REQUEST STATUS
    // =========================

    public Optional<Request> updateStatus(
            Long id,
            String status) {

        Optional<Request> existingRequest =
                requestRepository.findById(id);

        if (existingRequest.isEmpty()) {
            return Optional.empty();
        }

        Request request =
                existingRequest.get();

        request.setStatus(status);

        // =========================
        // UPDATE DONATION STATUS
        // =========================

        Optional<Donation> donation =
                donationRepository.findById(
                        request.getDonationId()
                );

        if (donation.isPresent()) {

            Donation existingDonation =
                    donation.get();

            if ("ACCEPTED".equalsIgnoreCase(status)) {

                existingDonation.setStatus(
                        "ACCEPTED"
                );

            } else if ("REJECTED".equalsIgnoreCase(status)) {

                existingDonation.setStatus(
                        "AVAILABLE"
                );
            }

            donationRepository.save(
                    existingDonation
            );
        }

        return Optional.of(
                requestRepository.save(request)
        );
    }

    // =========================
    // DELETE REQUEST
    // =========================

    public void deleteRequest(Long id) {

        requestRepository.deleteById(id);
    }
}