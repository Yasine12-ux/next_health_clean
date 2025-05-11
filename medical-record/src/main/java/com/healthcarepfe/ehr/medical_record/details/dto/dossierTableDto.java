package com.healthcarepfe.ehr.medical_record.details.dto;

import com.healthcarepfe.ehr.medical_record.details.GroupeSanguin;

public record dossierTableDto(Integer PatientId, String name , String prenom, Integer ordonnacesCount, Integer consultationsCount, Integer examensCount, GroupeSanguin groupeSanguin) {
    public static dossierTableDto ConvertTo(Integer patientId, String name , String prenom, Integer ordonnacesCount, Integer consultationsCount, Integer examensCount, GroupeSanguin groupeSanguin) {
        return new dossierTableDto(
                patientId,
                name,
                prenom,
                ordonnacesCount,
                consultationsCount,
                examensCount,
                groupeSanguin
        );
    }

}
