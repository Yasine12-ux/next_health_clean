package com.aziz.security.medical_record.examen;

import com.aziz.security.config.JwtService;
import com.aziz.security.medical_record.client.dto.ExamenDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("dossier-medical/examen")
@RequiredArgsConstructor
public class ExamenController {

    private final ExamenService examenService;
    private final JwtService    jwtService;

    @Operation(summary = "✅ : get all examens by patient id")
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllExamensByPatientId(
            HttpServletRequest request,
            @PathVariable Integer id){
        if(request.getHeader("Authorization")==null) return ResponseEntity.badRequest().body("No token found");
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return examenService.getAllExamenById(email,id);
    }

    @Operation(summary = "✅ : create examen")
    @PostMapping("/create/{consultation_id}")
    public ResponseEntity<?> createExamen(
            HttpServletRequest request,
            @PathVariable Integer consultation_id,
            @RequestBody ExamenDto examenDto){
        if(request.getHeader("Authorization")==null) return ResponseEntity.badRequest().body("No token found");
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return examenService.createExamen(email,consultation_id,examenDto);
    }

    @Operation(summary = "✅ : update examen")
    @PutMapping("/update")
    public ResponseEntity<?> updateExamen(
            HttpServletRequest request,
            @RequestBody ExamenDto examenDto){
        if(request.getHeader("Authorization")==null) return ResponseEntity.badRequest().body("No token found");
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return examenService.updateExamen(email,examenDto);
    }


}
