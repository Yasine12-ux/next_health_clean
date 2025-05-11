package com.aziz.security.medical_record.client;

import com.aziz.security.medical_record.client.dto.FichePatientDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "dossier-medical",url = "${application.config.dossier-medical-url}/dossier-medical")
public interface FichePatientClient {
    @PostMapping("/init/{userId}")
    ResponseEntity<?> initFichePatient(@PathVariable Integer userId);
    @PostMapping("/create")
    ResponseEntity<?> createFichePatient(@RequestBody FichePatientDto fichePatientDto);

    @PutMapping("/update")
    ResponseEntity<?> updateFichePatient(@RequestBody FichePatientDto fichePatientDto);

    @GetMapping("/all")
    ResponseEntity<?> getAllFichePatient();

    @GetMapping("/fiche/{id}")
    ResponseEntity<?> getFichePatientById(@PathVariable Integer id);
    @GetMapping("/table/{id}")
    public ResponseEntity<?> getDossierTable(@PathVariable Integer id);
}
