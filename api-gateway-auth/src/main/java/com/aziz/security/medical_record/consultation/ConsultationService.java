package com.aziz.security.medical_record.consultation;

import com.aziz.security.medical_record.client.ConsultationClient;
import com.aziz.security.medical_record.client.dto.ConsultationDto;
import com.aziz.security.medical_record.client.dto.FullConsultationDto;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class ConsultationService {
    private final UserRepository userRepository;
    private final AllPermissionService allPermissionService;
    private final ConsultationClient consultationClient;

    ResponseEntity<?> getAllConsultationsByPatientId(String email, Integer patientId) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get consultations");
        }
        return consultationClient.getAllConsultationsByPatientId(patientId);
    }

    ResponseEntity<?> getConsultationById(String email, Integer consultationId) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get consultations");
        }
        return consultationClient.getConsultationById(consultationId);
    }

    ResponseEntity<?> createConsultation(String email, Integer patientId, ConsultationDto consultationDto) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to create consultations");
        }
        return consultationClient.createConsultation(patientId, consultationDto);
    }

    ResponseEntity<?> updateConsultation(String email, ConsultationDto consultationDto) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to update consultations");
        }
        return consultationClient.updateConsultation(consultationDto);
    }


    ResponseEntity<?> completeConsultation(String email, Integer consultationId) {
        var user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to complete consultations");
        }
        try {
            return consultationClient.completeConsultation(consultationId, user.get().getId());
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error");
        }
    }

    ResponseEntity<?> getFullConsultationById(String email, Integer consultationId) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get consultations");
        }
        return consultationClient.getFullConsultationById(consultationId);
    }

    ResponseEntity<?> saveFullConsultation(String email, FullConsultationDto fullConsultationDto) {
        var user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to save consultations");
        }

        FullConsultationDto fullConsultationDto1 = new FullConsultationDto(
                user.get().getId(),
                fullConsultationDto.consultation(),
                fullConsultationDto.ordonnance(),
                fullConsultationDto.examens()
        );
        try {
            return consultationClient.saveFullConsultation(fullConsultationDto1);
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error");
        }
    }

    ResponseEntity<?> getOrCreateConsultation(String email, Integer idAppointment, Integer patientId, ConsultationDto consultationDto) {
        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!allPermissionService.userHasAnyPermission(userRepository.findByEmail(email).get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to get or create consultations");
        }
        return consultationClient.getOrCreateConsultation(idAppointment, patientId, consultationDto);
    }

}