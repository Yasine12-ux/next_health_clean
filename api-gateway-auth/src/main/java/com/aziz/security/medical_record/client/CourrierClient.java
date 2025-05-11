package com.aziz.security.medical_record.client;

import com.aziz.security.medical_record.client.dto.CourrierDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "dossier-medical-courriers",url = "${application.config.dossier-medical-url}/dossier-medical/courriers")
public interface CourrierClient {
    @GetMapping("all/{id}")
    public ResponseEntity<?> getAllCourriersByPatientId(@PathVariable Integer id);
    @GetMapping("/consultation/{id}")
    public ResponseEntity<?> getAllCourriersByConsultationId(@PathVariable Integer id);
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createCourrier(
            @PathVariable Integer consultation_id,
            @RequestBody CourrierDto courrierDto);
    @PutMapping("/update")
    public ResponseEntity<?> updateCourrier(
            @RequestBody CourrierDto courrierDto);
}
