package com.aziz.security.medical_record.prescription;

import com.aziz.security.medical_record.client.OrdonnanceClient;
import com.aziz.security.medical_record.client.dto.OrdonnanceDto;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class PrescriptionService {
    private final OrdonnanceClient ordonnanceClient;
    private final UserRepository userRepository;
    private final AllPermissionService allPermissionService;

    ResponseEntity<?> getAllOrdonnancesByPatientId(String email, Integer patientId) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if(!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get ordonnances");
        }

        return ordonnanceClient.getAllOrdonnancesByPatientId(patientId);
    }

    ResponseEntity<?> getOrdonnanceById(String email, Integer ordonnanceId) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if(!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get ordonnances");
        }

        return ordonnanceClient.getOrdonnanceById(ordonnanceId);
    }

    ResponseEntity<?> createOrdonnance(String email, Integer consultationId, OrdonnanceDto ordonnanceDto) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if(!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to create ordonnances");
        }

        return ordonnanceClient.createOrdonnance(consultationId, ordonnanceDto);
    }

}
