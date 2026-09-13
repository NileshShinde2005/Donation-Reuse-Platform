package com.donation.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.donation.server.model.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonatedBy(String donatedBy);
}