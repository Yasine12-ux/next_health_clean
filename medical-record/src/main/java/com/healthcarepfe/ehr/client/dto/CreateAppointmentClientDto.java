package com.healthcarepfe.ehr.client.dto;


import com.healthcarepfe.ehr.client.AppointmentStatus;

import java.time.LocalDateTime;

public record CreateAppointmentClientDto(Integer patientId, String appointmentDescription, LocalDateTime startTime, LocalDateTime endTime,
                                         AppointmentStatus status, Integer createdBy, Integer appointmentLocationPlantId) {
}
