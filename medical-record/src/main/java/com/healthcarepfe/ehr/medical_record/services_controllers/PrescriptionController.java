package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.details.dto.OrdonnanceDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dossier-medical/ordonnances")
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    @Operation(summary = "✅ : get all ordonnances by patient id")
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllOrdonnancesByPatientId(@PathVariable Integer id){
        return prescriptionService.getAllOrdonnances(id);
    }

    @Operation(summary = "✅ : get ordonnance by id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrdonnanceById(@PathVariable Integer id){
        return prescriptionService.getOrdonnance(id);
    }

    @Operation(summary = "✅ : create ordonnance")
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createOrdonnance(
            @PathVariable Integer consultation_id,
            @RequestBody OrdonnanceDto ordonnanceDto){
        return prescriptionService.createOrdonnance(consultation_id,ordonnanceDto);
    }


}
