package com.healthcarepfe.ehr.medical_record.details.dto;

public record OrdonnanceDto(
        int id,
        String date,
        String categorie,
        String description
) {
    public static OrdonnanceDto fromEntity(com.healthcarepfe.ehr.medical_record.details.Ordonnance entity) {
        return new OrdonnanceDto(
                entity.getId(),
                entity.getDate().toString(),
                entity.getCatergorie(),
                entity.getDescription()
        );
    }
}
