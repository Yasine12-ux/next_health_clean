package com.aziz.security.medical_record.client;

import com.aziz.security.medical_record.client.dto.OrdonnanceDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "dossier-medical-ordonnances",url = "${application.config.dossier-medical-url}/dossier-medical/ordonnances")
public interface OrdonnanceClient {
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllOrdonnancesByPatientId(@PathVariable Integer id);
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrdonnanceById(@PathVariable Integer id);
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createOrdonnance(
            @PathVariable Integer  consultation_id,
            @RequestBody OrdonnanceDto ordonnanceDto);

}
