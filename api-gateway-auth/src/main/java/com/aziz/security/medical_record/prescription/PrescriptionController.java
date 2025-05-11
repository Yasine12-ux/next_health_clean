package com.aziz.security.medical_record.prescription;

import com.aziz.security.config.JwtService;
import com.aziz.security.medical_record.client.dto.OrdonnanceDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("dossier-medical/ordonnance")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;
    private final JwtService jwtService;

    @Operation(summary = "✅ : get all ordonnances by patient id")
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllOrdonnancesByPatientId(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return ResponseEntity.badRequest().body("No token found");
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return prescriptionService.getAllOrdonnancesByPatientId(email,id);
    }

    @Operation(summary = "✅ : get ordonnance by id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrdonnanceById(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return ResponseEntity.badRequest().body("No token found");
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return prescriptionService.getOrdonnanceById(email,id);
    }

    @Operation(summary = "✅ : create ordonnance by consultation id")
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createOrdonnance(
            HttpServletRequest request,
            @PathVariable Integer consultation_id,
            @RequestBody OrdonnanceDto ordonnanceDto){
        if(request.getHeader("Authorization")==null) return ResponseEntity.badRequest().body("No token found");
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return prescriptionService.createOrdonnance(email,consultation_id,ordonnanceDto);
    }

}
