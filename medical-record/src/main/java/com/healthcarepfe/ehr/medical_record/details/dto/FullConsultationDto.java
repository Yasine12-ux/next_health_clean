package com.healthcarepfe.ehr.medical_record.details.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.healthcarepfe.ehr.medical_record.details.Examen;

import java.util.List;


@JsonIgnoreProperties
public record FullConsultationDto(
        Integer doctorId,
        ConsultationDto consultation,
        OrdonnanceDto ordonnance,
        List<ExamenDto> examens
) {
}
