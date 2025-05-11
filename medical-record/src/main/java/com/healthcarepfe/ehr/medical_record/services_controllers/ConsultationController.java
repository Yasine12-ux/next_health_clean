package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.Dto.FichePatientDto;
import com.healthcarepfe.ehr.medical_record.details.dto.ConsultationDto;
import com.healthcarepfe.ehr.medical_record.details.dto.FullConsultationDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dossier-medical/consultations")
public class ConsultationController {
    private final ConsultationService consultationService;

    @Operation(summary = "✅ : get all consultations by patient id")
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllConsultationsByPatientId(@PathVariable Integer id){
        return consultationService.getAllConsultations(id);
    }
    @Operation(summary = "✅ : get consultation by id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getConsultationById(@PathVariable Integer id){
        return consultationService.getConsultation(id);
    }
    @Operation(summary = "✅ : create consultation")
    @PostMapping("/create/{patient_id}")
    public ResponseEntity<?> createConsultation(
            @PathVariable Integer patient_id,
            @RequestBody ConsultationDto consultationDto){
        return consultationService.createConsultation(patient_id,consultationDto);
    }

    @Operation(summary = "✅ : get or create consultation")
    @PostMapping("/get-or-create/{idAppointment}/{patient_id}")
    public ResponseEntity<?> getOrCreateConsultation(
            @PathVariable Integer idAppointment,
            @PathVariable Integer patient_id,
            @RequestBody ConsultationDto consultationDto
    ){
        return consultationService.getOrCreateByAppointmentId(idAppointment,patient_id,consultationDto);
    }

    @Operation(summary = "✅ : update consultation")
    @PutMapping("/update")
    public ResponseEntity<?> updateConsultation(
            @RequestBody ConsultationDto consultationDto){
        return consultationService.updateConsultation(consultationDto);
    }

    @Operation(summary = "✅ : complete consultation")
    @PutMapping("/complete/{id}/{doctor_id}")
    public ResponseEntity<?> completeConsultation(
            @PathVariable Integer id,
            @PathVariable Integer doctor_id){
        return consultationService.completeConsultation(id,doctor_id);
    }

    @Operation(summary = "✅ : get full consultation by id")
    @GetMapping("/full/{id}")
    public ResponseEntity<?> getFullConsultationById(@PathVariable Integer id){
        return consultationService.getFullConsultation(id);
    }

    @Operation(summary = "✅ : save full consultation")
    @PostMapping("/save-full-consultation")
    public ResponseEntity<?> saveFullConsultation(@RequestBody FullConsultationDto fullConsultationDto){
        return consultationService.saveFullConsultation(fullConsultationDto);
    }

}
