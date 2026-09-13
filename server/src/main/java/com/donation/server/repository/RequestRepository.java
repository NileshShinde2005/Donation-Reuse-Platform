package com.donation.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.donation.server.model.Request;

public interface RequestRepository
        extends JpaRepository<Request, Long> {

    // =========================
    // GET REQUESTS BY USER
    // =========================

    List<Request> findByRequestedBy(String requestedBy);

    // =========================
    // GET INCOMING REQUESTS
    // =========================

    List<Request> findByDonorEmail(String donorEmail);

    // =========================
    // CHECK DUPLICATE REQUEST
    // =========================

    boolean existsByDonationIdAndRequestedBy(
            Long donationId,
            String requestedBy
    );
}