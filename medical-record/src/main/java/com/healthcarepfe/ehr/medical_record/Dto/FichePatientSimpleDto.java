package com.healthcarepfe.ehr.medical_record.Dto;

import com.healthcarepfe.ehr.medical_record.MedicalRecord;

public record FichePatientSimpleDto(Integer userId, String nom, String prenom, String dateNaissance, String sexe) {
    public static FichePatientSimpleDto fromDossierMedical(MedicalRecord medicalRecord) {
        if(medicalRecord.getFicheAdministrative()!=null)
            return new FichePatientSimpleDto(medicalRecord.getUserId(), medicalRecord.getFicheAdministrative().getNom(), medicalRecord.getFicheAdministrative().getPrenom(), (medicalRecord.getFicheAdministrative().getDateNaissance()!=null)? medicalRecord.getFicheAdministrative().getDateNaissance().toString():null, medicalRecord.getFicheAdministrative().getSexe());
        return new FichePatientSimpleDto(medicalRecord.getUserId(), null, null, null, null);
    }
}
