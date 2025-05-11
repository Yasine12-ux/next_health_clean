package com.healthcarepfe.ehr.medical_record.details.dto;

import com.healthcarepfe.ehr.medical_record.details.Examen;

public record ExamenDto(
        Integer id,
        String date,
        String resultat,
        String regionexamenee,
        String type)
{
    public static ExamenDto fromEntity(
            Examen entity) {
        return new ExamenDto(
                entity.getId(),
                entity.getDate().toString(),
                entity.getResultat(),
                entity.getRegionExamenee(),
                entity.getType()
        );
    }
}
