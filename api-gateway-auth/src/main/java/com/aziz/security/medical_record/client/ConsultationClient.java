package com.aziz.security.medical_record.client;

import com.aziz.security.medical_record.client.dto.ConsultationDto;

import com.aziz.security.medical_record.client.dto.FullConsultationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "dossier-medical-consultations",url = "${application.config.dossier-medical-url}/dossier-medical/consultations")
public interface ConsultationClient {
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllConsultationsByPatientId(@PathVariable Integer id);
    @GetMapping("/{id}")
    public ResponseEntity<?> getConsultationById(@PathVariable Integer id);
    @PostMapping("/create/{patient_id}")
    public ResponseEntity<?> createConsultation(
            @PathVariable Integer patient_id,
            @RequestBody ConsultationDto consultationDto);
    @PutMapping("/update")
    public ResponseEntity<?> updateConsultation(
            @RequestBody ConsultationDto consultationDto);

    @PutMapping("/complete/{id}/{doctor_id}")
    ResponseEntity<?> completeConsultation(
            @PathVariable Integer id,
            @PathVariable Integer doctor_id);

    @GetMapping("/full/{id}")
    ResponseEntity<?> getFullConsultationById(@PathVariable Integer id);

    @PostMapping("/save-full-consultation")
    ResponseEntity<?> saveFullConsultation(@RequestBody FullConsultationDto fullConsultationDto);

    @PostMapping("/get-or-create/{idAppointment}/{patient_id}")
    ResponseEntity<?> getOrCreateConsultation(
            @PathVariable Integer idAppointment,
            @PathVariable Integer patient_id,
            @RequestBody ConsultationDto consultationDto
    );
}
