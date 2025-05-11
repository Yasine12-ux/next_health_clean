package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.client.AppointmentClient;
import com.healthcarepfe.ehr.client.AppointmentStatus;
import com.healthcarepfe.ehr.client.dto.ChangeAppointmentStatusClientDto;
import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.details.Consultation;
import com.healthcarepfe.ehr.medical_record.details.Ordonnance;
import com.healthcarepfe.ehr.medical_record.details.dto.ConsultationDto;
import com.healthcarepfe.ehr.medical_record.details.dto.ExamenDto;
import com.healthcarepfe.ehr.medical_record.details.dto.FullConsultationDto;
import com.healthcarepfe.ehr.medical_record.details.dto.OrdonnanceDto;
import com.healthcarepfe.ehr.medical_record.repositories.ConsultationRepository;
import com.healthcarepfe.ehr.medical_record.repositories.DossierMedicalRepository;
import com.healthcarepfe.ehr.medical_record.repositories.ExamenRepository;
import com.healthcarepfe.ehr.medical_record.repositories.OrdonnanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final DossierMedicalRepository dossierMedicalRepository;
    private final ConsultationRepository consultationRepository;
    private final AppointmentClient appointmentClient;
    private final ExamenRepository examenRepository;
    private final OrdonnanceRepository ordonnanceRepository;
    /**
     * Get all consultations for a user
     *
     * @param userId
     * @return ResponseEntity
     */
    ResponseEntity<?> getAllConsultations(Integer userId) {
        Optional<MedicalRecord> dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if (dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();

        MedicalRecord medicalRecord = dossierMedicalOptional.get();

        if (medicalRecord.getConsultations() == null)
            return ResponseEntity.ok(new ArrayList<>());


        List<ConsultationDto> consultations = medicalRecord.getConsultations().stream().map(ConsultationDto::fromEntity).collect(Collectors.toList());

        return ResponseEntity.ok(consultations);
    }

    ResponseEntity<?> createConsultation(Integer userId, ConsultationDto consultationDto) {

        Optional<MedicalRecord> dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if (dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();

        MedicalRecord medicalRecord = dossierMedicalOptional.get();
        Consultation consultation = Consultation.builder()
                .date(LocalDateTime.now())
                .motif(consultationDto.motif())
                .poidsKg(consultationDto.poidsKg())
                .tailleCm(consultationDto.tailleCm())
                .pouls(consultationDto.pouls())
                .idAppointment(consultationDto.idAppointment())
                .tensionArterielle(consultationDto.tensionArterielle())
                .diagnostic(consultationDto.diagnostic())
                .complete(false)
                .build();
        consultation.setMedicalRecord(medicalRecord);
        consultation = consultationRepository.save(consultation);
        medicalRecord.getConsultations().add(consultation);
        dossierMedicalRepository.save(medicalRecord);
        return ResponseEntity.ok(ConsultationDto.fromEntity(consultation));
    }

    ResponseEntity updateConsultation(ConsultationDto consultationDto) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(consultationDto.id());
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Consultation consultation = consultationOptional.get();
        consultation.setDate(consultationDto.date());
        consultation.setMotif(consultationDto.motif());
        consultation.setPoidsKg(consultationDto.poidsKg());
        consultation.setTailleCm(consultationDto.tailleCm());
        consultation.setPouls(consultationDto.pouls());
        consultation.setTensionArterielle(consultationDto.tensionArterielle());
        consultation.setDiagnostic(consultationDto.diagnostic());
        consultation.setComplete(consultationDto.complete());
        consultationRepository.save(consultation);
        return ResponseEntity.ok(ConsultationDto.fromEntity(consultation));
    }

    ResponseEntity<?> completeConsultation(Integer id,Integer doctorId) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(id);
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Consultation consultation = consultationOptional.get();

        System.out.println("Changing appointment status"+consultation.getIdAppointment()+" "+AppointmentStatus.COMPLETED+" "+ doctorId);
        try {
            appointmentClient.changeAppointmentStatus(new ChangeAppointmentStatusClientDto(consultation.getIdAppointment(), AppointmentStatus.COMPLETED, doctorId));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error while changing appointment status");
        }


        consultation.setComplete(true);
        consultationRepository.save(consultation);
        return ResponseEntity.ok(ConsultationDto.fromEntity(consultation));
    }

    public ResponseEntity<?> getConsultation(Integer id) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(id);
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Consultation consultation = consultationOptional.get();
        return ResponseEntity.ok(ConsultationDto.fromEntity(consultation));
    }

    public ResponseEntity<?> getFullConsultation(Integer id) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(id);
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();
        Consultation consultation = consultationOptional.get();
        FullConsultationDto fullConsultationDto = new FullConsultationDto(
                null,
                ConsultationDto.fromEntity(consultation),
                consultation.getOrdonnance() != null ? OrdonnanceDto.fromEntity(consultation.getOrdonnance()) : null,
                consultation.getExamen().stream().map(ExamenDto::fromEntity).collect(Collectors.toList())
        );
        return ResponseEntity.ok(fullConsultationDto);
    }

    // save consultation with ordonnance.
    public ResponseEntity<?> saveFullConsultation( FullConsultationDto fullConsultationDto) {
        Optional<Consultation> consultationOptional = consultationRepository.findById(fullConsultationDto.consultation().id());
        if (consultationOptional.isEmpty())
            return ResponseEntity.notFound().build();

        Consultation consultation = consultationOptional.get();
        consultation.setDate(fullConsultationDto.consultation().date());
        consultation.setMotif(fullConsultationDto.consultation().motif());
        consultation.setPoidsKg(fullConsultationDto.consultation().poidsKg());
        consultation.setTailleCm(fullConsultationDto.consultation().tailleCm());
        consultation.setPouls(fullConsultationDto.consultation().pouls());
        consultation.setTensionArterielle(fullConsultationDto.consultation().tensionArterielle());
        consultation.setDiagnostic(fullConsultationDto.consultation().diagnostic());
        consultation.setComplete(true);
        if (fullConsultationDto.ordonnance() != null) {
            consultation.setOrdonnance(Ordonnance.builder()
                    .date(LocalDateTime.now())
                    .catergorie(fullConsultationDto.ordonnance().categorie())
                    .description(fullConsultationDto.ordonnance().description())
                    .build());
            ordonnanceRepository.save(consultation.getOrdonnance());
        }

        consultationRepository.save(consultation);

        try {
            appointmentClient.changeAppointmentStatus(new ChangeAppointmentStatusClientDto(consultation.getIdAppointment(), AppointmentStatus.COMPLETED, fullConsultationDto.doctorId()));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error while changing appointment status");
        }
        List<ExamenDto> examenDtos= consultation.getExamen().stream().map(ExamenDto::fromEntity).collect(Collectors.toList());

        return ResponseEntity.ok(new FullConsultationDto(0,ConsultationDto.fromEntity(consultation),fullConsultationDto.ordonnance() ,examenDtos));
    }
    public ResponseEntity<?> getOrCreateByAppointmentId(Integer appointmentId,Integer idPatient,ConsultationDto consultationDto) {
        Optional<Consultation> consultationOptional = consultationRepository.findByIdAppointment(appointmentId);
        if (consultationOptional.isPresent())
            return ResponseEntity.ok(ConsultationDto.fromEntity(consultationOptional.get()));
        return createConsultation(idPatient,consultationDto);
    }
}
