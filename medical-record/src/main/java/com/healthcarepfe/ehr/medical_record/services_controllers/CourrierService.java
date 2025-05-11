package com.healthcarepfe.ehr.medical_record.services_controllers;


import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.details.Consultation;
import com.healthcarepfe.ehr.medical_record.details.Courrier;
import com.healthcarepfe.ehr.medical_record.details.dto.CourrierDto;
import com.healthcarepfe.ehr.medical_record.repositories.ConsultationRepository;
import com.healthcarepfe.ehr.medical_record.repositories.CourrierRepository;
import com.healthcarepfe.ehr.medical_record.repositories.DossierMedicalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourrierService {
    private final CourrierRepository courrierRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final ConsultationRepository consultationRepository;

    /**
     * Get all courriers for a user
     *
     * @param userId
     * @return ResponseEntity
     */
    ResponseEntity<?> getAllCourriersByPatient(Integer userId) {
        Optional<MedicalRecord> dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if (dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();

        MedicalRecord medicalRecord = dossierMedicalOptional.get();

        if (medicalRecord.getConsultations() == null)
            return ResponseEntity.ok(new ArrayList<>());

        List<CourrierDto> courriers = medicalRecord.getConsultations().stream().map(Consultation::getCourrier).filter(Objects::nonNull)
                .map(CourrierDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(courriers);
    }

    ResponseEntity<?> getAllByConsultationId(Integer consultationId) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(consultationId);
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Consultation consultation = consultationOptional.get();
        if (consultation.getCourrier() == null)
            return ResponseEntity.ok(new ArrayList<>());
        return ResponseEntity.ok(CourrierDto.fromEntity(consultation.getCourrier()));
    }


    ResponseEntity<?> createCourrier(Integer consultationId, CourrierDto courrierDto) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(consultationId);
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();

        Consultation consultation = consultationOptional.get();
        Courrier courrier = Courrier.builder()
                .creationDate(LocalDate.now())
                .destinataire(courrierDto.destinataire())
                .description(courrierDto.description())
                .build();
        courrier = courrierRepository.save(courrier);
        consultation.setCourrier(courrier);
        consultationRepository.save(consultation);
        return ResponseEntity.ok(CourrierDto.fromEntity(courrier));
    }

    ResponseEntity<?> updateCourrier(CourrierDto courrierDto) {
        Optional<Courrier> courrierOptional = courrierRepository.findById(courrierDto.id());
        if (courrierOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Courrier courrier = courrierOptional.get();
        courrier.setDestinataire(courrierDto.destinataire());
        courrier.setDescription(courrierDto.description());
        return ResponseEntity.ok(CourrierDto.fromEntity(courrierRepository.save(courrier)));
    }
}