package com.healthcarepfe.ehr.medical_record.details.dto;

public record CourrierDto(
        Integer id,
        String creationDate,
        String destinataire,
        String description
) {
    public static CourrierDto fromEntity(com.healthcarepfe.ehr.medical_record.details.Courrier entity) {
        return new CourrierDto(
                entity.getId(),
                entity.getCreationDate().toString(),
                entity.getDestinataire(),
                entity.getDescription()
        );
    }
}
