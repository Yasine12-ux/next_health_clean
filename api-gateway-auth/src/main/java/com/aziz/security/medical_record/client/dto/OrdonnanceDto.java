package com.aziz.security.medical_record.client.dto;

public record OrdonnanceDto(
        int id,
        String date,
        String categorie,
        String description
) {
}
