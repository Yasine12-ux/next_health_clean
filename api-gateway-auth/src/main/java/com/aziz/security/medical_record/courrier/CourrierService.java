package com.aziz.security.medical_record.courrier;

import com.aziz.security.medical_record.client.CourrierClient;
import com.aziz.security.medical_record.client.dto.CourrierDto;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class CourrierService {
    private final CourrierClient courrierClient;
    private final UserRepository userRepository;
    private final AllPermissionService allPermissionService;

    ResponseEntity<?> getAllCourriersByPatientId(String email,Integer patientId) {
        var user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get courriers");
        }
        return courrierClient.getAllCourriersByPatientId(patientId);
    }
    ResponseEntity<?> getAllCourriersByConsultationId(String email, Integer consultationId) {
        var user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get courriers");
        }
        return courrierClient.getAllCourriersByConsultationId(consultationId);
    }

    ResponseEntity<?> createCourrier(String email, Integer consultationId, CourrierDto courrierDto) {
        var user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to create courriers");
        }
        return courrierClient.createCourrier(consultationId, courrierDto);
    }

    ResponseEntity<?> updateCourrier(String email, CourrierDto courrierDto) {
        var user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to update courriers");
        }
        return courrierClient.updateCourrier(courrierDto);
    }


}
