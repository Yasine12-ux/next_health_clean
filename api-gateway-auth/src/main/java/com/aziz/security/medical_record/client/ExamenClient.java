package com.aziz.security.medical_record.client;

import com.aziz.security.medical_record.client.dto.ExamenDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "dossier-medical-exmanes",url = "${application.config.dossier-medical-url}/dossier-medical/exmanes")
public interface ExamenClient {
    @GetMapping("/examens/{id}")
    public ResponseEntity<?> getAllExamensByPatientId(@PathVariable Integer id);

    @PostMapping("/create/{patient_id}")
    public ResponseEntity<?> createExamen(
            @PathVariable Integer patient_id,
            @RequestBody ExamenDto examenDto);
    @PutMapping("/update")
    public ResponseEntity<?> updateExamen(
            @RequestBody ExamenDto examenDto);
}
