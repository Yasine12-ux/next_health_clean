package com.aziz.security.medical_record.client.dto;

public record ExamenDto(
        Integer id,
        String date,
        String resultat,
        String regionexamenee,
       String type)
{
}
