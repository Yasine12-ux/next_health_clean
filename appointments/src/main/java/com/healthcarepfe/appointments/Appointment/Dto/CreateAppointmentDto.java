package com.healthcarepfe.appointments.Appointment.Dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.healthcarepfe.appointments.Appointment.AppointmentStatus;

import java.time.LocalDateTime;
public record CreateAppointmentDto(Integer patientId, String appointmentDescription, LocalDateTime startTime, LocalDateTime endTime,
                                   AppointmentStatus status, Integer createdBy,Integer appointmentLocationPlantId) {
}