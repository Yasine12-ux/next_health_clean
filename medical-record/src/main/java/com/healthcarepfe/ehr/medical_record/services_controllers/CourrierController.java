package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.details.dto.CourrierDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dossier-medical/courriers")
public class CourrierController {
    private final CourrierService courrierService;

    @Operation(summary = "✅ : get all courriers by patient id")
    @GetMapping("all/{id}")
    public ResponseEntity<?> getAllCourriersByPatientId(@PathVariable Integer id) {
        return courrierService.getAllCourriersByPatient(id);
    }


    @Operation(summary = "✅ : get all courriers by consultation id")
    @GetMapping("/consultation/{id}")
    public ResponseEntity<?> getAllCourriersByConsultationId(@PathVariable Integer id) {
        return courrierService.getAllByConsultationId(id);
    }

    @Operation(summary = "✅ : create courrier")
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createCourrier(
            @PathVariable Integer consultation_id,
            @RequestBody CourrierDto courrierDto) {
        return courrierService.createCourrier(consultation_id, courrierDto);
    }
    @Operation(summary = "✅ : update courrier")
    @PutMapping("/update")
    public ResponseEntity<?> updateCourrier(
            @RequestBody CourrierDto courrierDto) {
        return courrierService.updateCourrier(courrierDto);
    }
}


