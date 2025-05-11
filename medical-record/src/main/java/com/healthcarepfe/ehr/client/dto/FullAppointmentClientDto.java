package com.healthcarepfe.ehr.client.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.healthcarepfe.ehr.client.AppointmentStatus;

import java.time.LocalDateTime;

public record FullAppointmentClientDto(
        @JsonProperty("id") Integer id,
        @JsonProperty("patientId") Integer patientId,
        @JsonProperty("creationDate") LocalDateTime creationDate,
        @JsonProperty("appointmentDescription") String appointmentDescription,
        @JsonProperty("startTime") LocalDateTime startTime,
        @JsonProperty("endTime") LocalDateTime endTime,
        @JsonProperty("status") AppointmentStatus status,
        @JsonProperty("createdBy") Integer createdBy,
        @JsonProperty("canceledBy") Integer canceledBy,
        @JsonProperty("appointmentLocationPlantId")Integer appointmentLocationPlantId
) {
}
