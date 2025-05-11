package com.aziz.security.medical_record.examen;

import com.aziz.security.medical_record.client.ExamenClient;
import com.aziz.security.medical_record.client.dto.ExamenDto;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class ExamenService {
    private final ExamenClient examenClient;
    private final UserRepository userRepository;
    private final AllPermissionService allPermissionService;

    ResponseEntity<?> getAllExamenById(String email, Integer patientId){
        var User = userRepository.findByEmail(email);
        if(User.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(User.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))){
            return ResponseEntity.badRequest().body("You don't have permission to get examens");
        }
        return examenClient.getAllExamensByPatientId(patientId);
    }

    ResponseEntity<?> createExamen(String email, Integer consultationId, ExamenDto examenDto){
        System.out.println(examenDto);
        var User = userRepository.findByEmail(email);
        if(User.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(User.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))){
            return ResponseEntity.badRequest().body("You don't have permission to create examens");
        }
        return examenClient.createExamen(consultationId,examenDto);
    }

    ResponseEntity<?> updateExamen(String email, ExamenDto examenDto){
        var User = userRepository.findByEmail(email);
        if(User.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        if(!allPermissionService.userHasAnyPermission(User.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))){
            return ResponseEntity.badRequest().body("You don't have permission to update examens");
        }
        return examenClient.updateExamen(examenDto);
    }
}
