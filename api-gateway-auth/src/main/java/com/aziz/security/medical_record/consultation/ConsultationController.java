package com.aziz.security.medical_record.consultation;

import com.aziz.security.config.JwtService;
import com.aziz.security.medical_record.client.dto.ConsultationDto;
import com.aziz.security.medical_record.client.dto.FullConsultationDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("dossier-medical/consultation")
@RequiredArgsConstructor
public class ConsultationController {
    private final ConsultationService consultationService;
    private final JwtService jwtService;

    @Operation(summary = "✅ : get all consultations")
    @GetMapping("/all/{patientId}")
    ResponseEntity<?> getAllConsultationsByPatientId(
            HttpServletRequest request,
            @PathVariable Integer patientId)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.getAllConsultationsByPatientId(email,patientId);
    }

    @Operation(summary = "✅ : get consultation by id")
    @GetMapping("/{id}")
    ResponseEntity<?> getConsultationById(
            HttpServletRequest request,
            @PathVariable Integer id)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.getConsultationById(email,id);
    }

    @Operation(summary = "✅ : create consultation")
    @PostMapping("/create/{patientId}")
    ResponseEntity<?> createConsultation(
            HttpServletRequest request,
            @PathVariable Integer patientId,
            @RequestBody ConsultationDto consultationDto)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.createConsultation(email,patientId,consultationDto);
    }

    

    @Operation(summary = "✅ : update consultation")
    @PutMapping("/update")
    ResponseEntity<?> updateConsultation(
            HttpServletRequest request,
            @RequestBody ConsultationDto consultationDto)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.updateConsultation(email,consultationDto);
    }

    @Operation(summary = "✅ : complete consultation")
    @PatchMapping("/complete/{id}/{doctorId}")
    ResponseEntity<?> completeConsultation(
            HttpServletRequest request,
            @PathVariable Integer id,
            @PathVariable Integer doctorId)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.completeConsultation(email,id);
    }

    @Operation(summary = "✅ : get full consultation by id")
    @GetMapping("/full/{id}")
    ResponseEntity<?> getFullConsultationById(
            HttpServletRequest request,
            @PathVariable Integer id)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.getFullConsultationById(email,id);
    }

    @Operation(summary = "✅ : save full consultation")
    @PostMapping("/save-full-consultation")
    ResponseEntity<?> saveFullConsultation(
            HttpServletRequest request,
            @RequestBody FullConsultationDto fullConsultationDto)
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.saveFullConsultation(email,fullConsultationDto);
    }

    @Operation(summary = "✅ : get or create consultation")
    @PostMapping("/get-or-create/{idAppointment}/{patientId}")
    ResponseEntity<?> getOrCreateConsultation(
            HttpServletRequest request,
            @PathVariable Integer idAppointment,
            @PathVariable Integer patientId,
            @RequestBody ConsultationDto consultationDto
    )
    {
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return consultationService.getOrCreateConsultation(email,idAppointment,patientId,consultationDto);
    }
}
