package com.aziz.security.medical_record.courrier;

import com.aziz.security.config.JwtService;
import com.aziz.security.medical_record.client.dto.CourrierDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("dossier-medical/courrier")
@RequiredArgsConstructor
public class CourrierController {
    private final CourrierService courrierService;
    private final JwtService    jwtService;


    @Operation(summary = "✅ : get all courriers by patient id")
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllCourriersByPatientId(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return courrierService.getAllCourriersByPatientId(email,id);
    }

    @Operation(summary = "✅ : get all courriers by consultation id")
    @GetMapping("/consultation/{id}")
    public ResponseEntity<?> getAllCourriersByConsultationId(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return courrierService.getAllCourriersByConsultationId(email,id);
    }

    @Operation(summary = "✅ : create courrier")
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createCourrier(
            HttpServletRequest request,
            @PathVariable Integer consultation_id,
            @RequestBody CourrierDto courrierDto){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return courrierService.createCourrier(email,consultation_id,courrierDto);
    }

    @Operation(summary = "✅ : update courrier")
    @PutMapping("/update")
    public ResponseEntity<?> updateCourrier(
            HttpServletRequest request,
            @RequestBody CourrierDto courrierDto){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return courrierService.updateCourrier(email,courrierDto);
    }
}
