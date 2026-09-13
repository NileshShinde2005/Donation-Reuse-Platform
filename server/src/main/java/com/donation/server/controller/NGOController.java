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

import com.donation.server.model.NGO;
import com.donation.server.service.NGOService;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "http://localhost:5173")
public class NGOController {

    private final NGOService ngoService;

    public NGOController(
            NGOService ngoService) {

        this.ngoService = ngoService;
    }

    // =========================
    // REGISTER NGO
    // =========================

    @PostMapping
    public ResponseEntity<NGO> createNGO(
            @RequestBody NGO ngo) {

        NGO savedNGO =
                ngoService.createNGO(ngo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedNGO);
    }

    // =========================
    // GET ALL NGOs
    // =========================

    @GetMapping
    public ResponseEntity<List<NGO>> getAllNGOs() {

        return ResponseEntity.ok(
                ngoService.getAllNGOs()
        );
    }

    // =========================
    // GET VERIFIED NGOs
    // =========================

    @GetMapping("/verified")
    public ResponseEntity<List<NGO>>
    getVerifiedNGOs() {

        return ResponseEntity.ok(
                ngoService.getVerifiedNGOs()
        );
    }

    // =========================
    // GET NGO BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getNGOById(
            @PathVariable Long id) {

        return ngoService
                .getNGOById(id)
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
    // VERIFY NGO
    // =========================

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyNGO(
            @PathVariable Long id) {

        return ngoService
                .verifyNGO(id)
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
    // DELETE NGO
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNGO(
            @PathVariable Long id) {

        if (ngoService
                .getNGOById(id)
                .isEmpty()) {

            return ResponseEntity
                    .status(
                            HttpStatus.NOT_FOUND
                    )
                    .body("NGO not found");
        }

        ngoService.deleteNGO(id);

        return ResponseEntity.ok(
                "NGO deleted successfully"
        );
    }
}