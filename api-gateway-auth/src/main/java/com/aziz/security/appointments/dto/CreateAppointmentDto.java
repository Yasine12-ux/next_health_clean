package com.aziz.security.appointments.dto;

import com.aziz.security.appointments.client.AppointmentStatus;
import com.aziz.security.appointments.client.dto.CreateAppointmentClientDto;

import java.time.LocalDateTime;

public record CreateAppointmentDto(Integer patientId, String appointmentDescription, LocalDateTime startTime,Integer appointmentLocationPlantId) {
    public static CreateAppointmentClientDto toCreateAppointmentClientDto(CreateAppointmentDto createAppointmentDto,Integer createdBy){
        return new CreateAppointmentClientDto(
                createAppointmentDto.patientId, createAppointmentDto.appointmentDescription,
                createAppointmentDto.startTime, createAppointmentDto.startTime.plusMinutes(15),AppointmentStatus.SCHEDULED,createdBy,createAppointmentDto.appointmentLocationPlantId);

    }

}
