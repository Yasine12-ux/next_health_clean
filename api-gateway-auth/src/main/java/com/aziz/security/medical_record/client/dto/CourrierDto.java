package com.aziz.security.medical_record.client.dto;

public record CourrierDto(
        Integer id,
        String creationDate,
        String destinataire,
        String description
) {
}
