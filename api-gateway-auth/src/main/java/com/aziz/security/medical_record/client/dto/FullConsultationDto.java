package com.aziz.security.medical_record.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties
public record FullConsultationDto(
        Integer doctorId,
        ConsultationDto consultation,
        OrdonnanceDto ordonnance,
        List<ExamenDto> examens
) {
}
