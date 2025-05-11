package com.aziz.security.medical_record;

import com.aziz.security.medical_record.client.FichePatientClient;
import com.aziz.security.medical_record.client.dto.FichePatientDto;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.user.User;
import com.aziz.security.user.UserRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final FichePatientClient fichePatientClient;
    private final UserRepository userRepository;
    private final AllPermissionService allPermissionService;
    public ResponseEntity<?> createDossierMedical(
            String email,
            FichePatientDto fichePatientDto) {

        ResponseEntity<String> User_not_found = verifyGereFichePatientPermission(email, fichePatientDto);
        if (User_not_found != null) return User_not_found;
        try {
            return fichePatientClient.createFichePatient(fichePatientDto);
        } catch (FeignException.FeignClientException.BadRequest e){
            return ResponseEntity.badRequest().body("Bad request");
        }
    }

    public ResponseEntity<?> updateDossierMedical(String email, FichePatientDto fichePatientDto) {
        ResponseEntity<String> User_not_found = verifyGereFichePatientPermission(email, fichePatientDto);
        if (User_not_found != null) return User_not_found;
        return fichePatientClient.updateFichePatient(fichePatientDto);
    }

    public ResponseEntity<?> getAllDossierMedical(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return fichePatientClient.getAllFichePatient();
    }
    public ResponseEntity<?> getFichePatientByIdOrCreate(String email, Integer id) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getFICHE_PATIENT_PERMISSION(),allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to gere fiches patients");
        }
        try {
            var fichPatient = fichePatientClient.getFichePatientById(id);
            return fichPatient;
        } catch (FeignException.FeignClientException.NotFound e){
            return fichePatientClient.initFichePatient(id);
        }catch (FeignException.FeignClientException.BadRequest e){
            return ResponseEntity.badRequest().body("Bad request");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error");
        }
    }

    private ResponseEntity<String> verifyGereFichePatientPermission(String email, FichePatientDto fichePatientDto) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getFICHE_PATIENT_PERMISSION(),allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to gere fiches patients");
        }

        var patientO= userRepository.findById(fichePatientDto.userId());
        if(patientO.isEmpty()) {
            return ResponseEntity.badRequest().body("Patient not found");
        }

        return null;
    }

    public ResponseEntity<?> getDossierTable(String email,Integer id) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if(!allPermissionService.userHasAnyPermission(user.get(), Set.of(allPermissionService.getDOSSIER_MEDICAL_PERMISSION()))) {
            return ResponseEntity.badRequest().body("You don't have permission to gere fiches patients");
        }

        return fichePatientClient.getDossierTable(id);
    }

}
