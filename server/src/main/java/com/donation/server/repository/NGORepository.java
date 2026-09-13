package com.donation.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.donation.server.model.NGO;

public interface NGORepository
        extends JpaRepository<NGO, Long> {

    List<NGO> findByVerifiedTrue();

    List<NGO> findByCityIgnoreCase(String city);
}