package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.details.dto.ExamenDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dossier-medical/exmanes")
public class ExamController {
    private final ExamService examService;

    @Operation(summary = "✅ : get all examens by patient id")
    @GetMapping("/examens/{id}")
    public ResponseEntity<?> getAllExamensByPatientId(@PathVariable Integer id){
        return examService.getAllExamen(id);
    }

    @Operation(summary = "✅ : create examen")
    @PostMapping("/create/{patient_id}")
    public ResponseEntity<?> createExamen(
            @PathVariable Integer patient_id,
            @RequestBody ExamenDto examenDto) {
        return examService.createExamen(patient_id, examenDto);
    }

    @Operation(summary = "✅ : update examen")
    @PutMapping("/update")
    public ResponseEntity<?> updateExamen(
            @RequestBody ExamenDto examenDto) {
        return examService.updateExamen(examenDto);
    }
}