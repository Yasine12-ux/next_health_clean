package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.Dto.FichePatientDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dossier-medical")
public class AdministrativeInformationController {
    private final AdministrativeInformationService administrativeInformationService;

    @PostMapping("/init/{userId}")
    public ResponseEntity<?> initFichePatient(@PathVariable Integer userId){
        return administrativeInformationService.initFichePatient(userId);
    }

    @Operation(summary = "✅ : create dossier medical (is better to use get fiche patient by id or init fiche patient(getFichePatientById()) instead of this method)")
    @PostMapping("/create")
    public ResponseEntity<?> createDossierMedical(
            @RequestBody FichePatientDto fichePatientDto){
        return administrativeInformationService.createFichePatient(fichePatientDto);
    }
    @Operation(summary = "✅ : update dossier medical")
    @PutMapping("/update")
    public ResponseEntity<?> updateDossierMedical(
            @RequestBody FichePatientDto fichePatientDto){
        return administrativeInformationService.updateFichePatient(fichePatientDto);
    }
    @Operation(summary = "✅ : get all dossier medical")
    @GetMapping("/all")
    public ResponseEntity<?> getAllDossierMedical(){
        return administrativeInformationService.getAllFichePatient();
    }
    @Operation(summary = "✅ : get dossier medical by id or create it if not exist")
    @GetMapping("/fiche/{id}")
    public ResponseEntity<?> getFichePatientById(@PathVariable Integer id){
        return administrativeInformationService.getFichePatient(id);
    }
//    getdossierTable

    @Operation(summary = "✅ : get dossier medical table")
    @GetMapping("/table/{id}")
    public ResponseEntity<?> getDossierTable(@PathVariable Integer id){
        return administrativeInformationService.getdossierTable(id);
    }



}
