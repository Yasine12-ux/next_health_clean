package com.healthcarepfe.ehr.medical_record.services_controllers;


import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.details.Consultation;
import com.healthcarepfe.ehr.medical_record.details.Examen;
import com.healthcarepfe.ehr.medical_record.details.dto.ExamenDto;
import com.healthcarepfe.ehr.medical_record.repositories.ConsultationRepository;
import com.healthcarepfe.ehr.medical_record.repositories.DossierMedicalRepository;
import com.healthcarepfe.ehr.medical_record.repositories.ExamenRepository;
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
public class ExamService {

    private final ExamenRepository examenRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final ConsultationRepository consultationRepository;

    /**
     * Get all courriers for a user
     *
     * @param userId
     * @return ResponseEntity
     */
    ResponseEntity<?> getAllExamen(Integer userId) {
        Optional<MedicalRecord> dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if (dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();

        MedicalRecord medicalRecord = dossierMedicalOptional.get();

        if (medicalRecord.getConsultations() == null)
            return ResponseEntity.ok(new ArrayList<>());

        List<ExamenDto> examens = medicalRecord.getConsultations().stream().map(Consultation::getExamen).filter(Objects::nonNull)
                .reduce(new ArrayList<>(), (acc, examen) -> {
                    acc.addAll(examen);
                    return acc;
                }).stream().map(ExamenDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(examens);
    }

    ResponseEntity<?> createExamen( Integer consultationId,ExamenDto examenDto){
        var consultation = consultationRepository.findById(consultationId);
        if(consultation.isEmpty())
            return ResponseEntity.notFound().build();
        System.out.println(examenDto);
        Examen examen = Examen.builder()
                .date(LocalDateTime.now())
                .resultat(examenDto.resultat())
                .regionExamenee(examenDto.regionexamenee())
                .type(examenDto.type())
                .consultation(consultation.get())
                .build();
        examen = examenRepository.save(examen);
        return ResponseEntity.ok(ExamenDto.fromEntity(examen));
        
    }

    ResponseEntity<?> updateExamen(ExamenDto examenDto){
        var examen = examenRepository.findById(examenDto.id());
        if(examen.isEmpty())
            return ResponseEntity.notFound().build();

        Examen examen1 = examen.get();
        examen1.setResultat(examenDto.resultat());
        examen1.setType(examenDto.type());
        examen1.setRegionExamenee(examenDto.regionexamenee());
        examen1 = examenRepository.save(examen1);
        return ResponseEntity.ok(ExamenDto.fromEntity(examen1));
    }


}