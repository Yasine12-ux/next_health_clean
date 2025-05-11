package com.healthcarepfe.appointments.Appointment.Dto;

import com.healthcarepfe.appointments.Appointment.Appointment;
import com.healthcarepfe.appointments.Appointment.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record FullAppointmentDto(Integer id, Integer patientId,LocalDateTime creationDate,String appointmentDescription, LocalDateTime startTime, LocalDateTime endTime,
                                 AppointmentStatus status,Integer createdBy,Integer canceledBy,Integer appointmentLocationPlantId) {
    public static  FullAppointmentDto toFullAppointmentDto(Appointment appointment){
        return new FullAppointmentDto(appointment.getId(),
                appointment.getPatientId(),
                appointment.getCreationDate(),
                appointment.getAppointmentDescription(),
                appointment.getStartTime(),
                appointment.getEndTime(),
                appointment.getStatus(),
                appointment.getCreatedBy(),
                appointment.getCanceledBy(),
                appointment.getAppointmentLocationPlantId());
    }
}
