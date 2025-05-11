package com.aziz.security.medical_record;

import com.aziz.security.config.JwtService;
import com.aziz.security.medical_record.client.dto.FichePatientDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dossier-medical")
@RequiredArgsConstructor
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;
    private final JwtService jwtService;

    @Operation(summary = "✅ : create dossier medical")
    @PostMapping("/create")
    public ResponseEntity<?> createDossierMedical(
            HttpServletRequest request,
            @RequestBody FichePatientDto fichePatientDto){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return medicalRecordService.createDossierMedical(email, fichePatientDto);
    }
    @Operation(summary = "✅ : update dossier medical")
    @PutMapping("/update")
    public ResponseEntity<?> updateDossierMedical(
            HttpServletRequest request,
            @RequestBody FichePatientDto fichePatientDto){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return medicalRecordService.updateDossierMedical(email, fichePatientDto);
    }
    @Operation(summary = "✅ : get all dossier medical")
    @GetMapping("/all")
    public ResponseEntity<?> getAllDossierMedical(
            HttpServletRequest request
            ){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return medicalRecordService.getAllDossierMedical(email);
    }

    @Operation(summary = "✅ : get FichePatient by id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getFichePatientById(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return medicalRecordService.getFichePatientByIdOrCreate(email, id);
    }
    @Operation(summary = "✅ : getdossierTableby id")
    @GetMapping("/table/{id}")
    public ResponseEntity<?> getDossierTable(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return medicalRecordService.getDossierTable(email, id);
    }

}
