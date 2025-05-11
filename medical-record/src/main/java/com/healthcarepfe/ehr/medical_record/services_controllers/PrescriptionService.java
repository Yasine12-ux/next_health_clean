package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.details.Consultation;
import com.healthcarepfe.ehr.medical_record.details.Ordonnance;
import com.healthcarepfe.ehr.medical_record.details.dto.OrdonnanceDto;
import com.healthcarepfe.ehr.medical_record.repositories.ConsultationRepository;
import com.healthcarepfe.ehr.medical_record.repositories.DossierMedicalRepository;
import com.healthcarepfe.ehr.medical_record.repositories.OrdonnanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final OrdonnanceRepository ordonnanceRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final ConsultationRepository consultationRepository;

    /**
     * Get all ordonnances for a user
     * @param userId
     * @return ResponseEntity
     */
    ResponseEntity<?> getAllOrdonnances(Integer userId) {

        Optional<MedicalRecord> dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if(dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();

        MedicalRecord medicalRecord = dossierMedicalOptional.get();

        if(medicalRecord.getConsultations() == null)
            return ResponseEntity.ok(new ArrayList<>());

        List<OrdonnanceDto> ordonnanceDtos = medicalRecord.getConsultations().stream().map(Consultation::getOrdonnance).filter(Objects::nonNull)
                .map(OrdonnanceDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(ordonnanceDtos);
    }

    ResponseEntity<?> createOrdonnance(Integer consultationId, OrdonnanceDto ordonnanceDto) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(consultationId);
        if(consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();

        Consultation consultation = consultationOptional.get();
        Ordonnance ordonnance = Ordonnance.builder()
                .date(LocalDateTime.now())
                .catergorie(ordonnanceDto.categorie())
                .description(ordonnanceDto.description())
                .build();
        ordonnance = ordonnanceRepository.save(ordonnance);
        consultation.setOrdonnance(ordonnance);
        consultationRepository.save(consultation);
        return ResponseEntity.ok(OrdonnanceDto.fromEntity(ordonnance));
    }

    ResponseEntity<?> getOrdonnance(Integer ordonnanceId) {
        var ordonnanceOptional = ordonnanceRepository.findById(ordonnanceId);
        if(ordonnanceOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Ordonnance ordonnance = ordonnanceOptional.get();
        return ResponseEntity.ok(OrdonnanceDto.fromEntity(ordonnance));
    }


}
