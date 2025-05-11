package com.healthcarepfe.ehr.medical_record.details.dto;

import com.healthcarepfe.ehr.medical_record.details.Consultation;

import java.time.LocalDateTime;

public record ConsultationDto(

        Integer id,
        Integer idPatient,
        String patientFullName,
        int idAppointment,
        boolean complete,
        LocalDateTime date,
        String motif,
        int poidsKg,
        int tailleCm,
        int pouls,
        int tensionArterielle,
        String diagnostic
) {
    public static ConsultationDto fromEntity(Consultation consultation) {
        return new ConsultationDto(
                consultation.getId(),
                consultation.getMedicalRecord().getUserId(),
                consultation.getMedicalRecord().getFicheAdministrative().getNom() + " " + consultation.getMedicalRecord().getFicheAdministrative().getPrenom(),
                consultation.getIdAppointment(),
                consultation.getComplete(),
                consultation.getDate(),
                consultation.getMotif(),
                consultation.getPoidsKg(),
                consultation.getTailleCm(),
                consultation.getPouls(),
                consultation.getTensionArterielle(),
                consultation.getDiagnostic()
        );
    }
}