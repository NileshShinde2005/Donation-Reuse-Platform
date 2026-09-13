package com.donation.server.service;

import com.donation.server.model.NGO;
import com.donation.server.repository.NGORepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NGOService {

    private final NGORepository ngoRepository;

    public NGOService(
            NGORepository ngoRepository) {

        this.ngoRepository = ngoRepository;
    }

    // =========================
    // REGISTER NGO
    // =========================

    public NGO createNGO(NGO ngo) {

        return ngoRepository.save(ngo);
    }

    // =========================
    // GET ALL NGOs
    // =========================

    public List<NGO> getAllNGOs() {

        return ngoRepository.findAll();
    }

    // =========================
    // GET VERIFIED NGOs
    // =========================

    public List<NGO> getVerifiedNGOs() {

        return ngoRepository.findByVerifiedTrue();
    }

    // =========================
    // GET NGO BY ID
    // =========================

    public Optional<NGO> getNGOById(Long id) {

        return ngoRepository.findById(id);
    }

    // =========================
    // VERIFY NGO
    // =========================

    public Optional<NGO> verifyNGO(Long id) {

        Optional<NGO> existing =
                ngoRepository.findById(id);

        if (existing.isEmpty()) {
            return Optional.empty();
        }

        NGO ngo = existing.get();

        ngo.setVerified(true);

        return Optional.of(
                ngoRepository.save(ngo)
        );
    }

    // =========================
    // DELETE NGO
    // =========================

    public void deleteNGO(Long id) {

        ngoRepository.deleteById(id);
    }
}