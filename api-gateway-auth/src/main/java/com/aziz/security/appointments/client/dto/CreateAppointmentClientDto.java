package com.aziz.security.appointments.client.dto;

import com.aziz.security.appointments.client.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

public record CreateAppointmentClientDto(Integer patientId, String appointmentDescription, LocalDateTime startTime, LocalDateTime endTime,
                                         AppointmentStatus status, Integer createdBy,Integer appointmentLocationPlantId) {
}
