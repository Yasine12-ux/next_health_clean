package com.aziz.security.appointments.dto;

import com.aziz.security.appointments.client.AppointmentStatus;
import com.aziz.security.appointments.client.dto.FullAppointmentClientDto;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


public record FullAppointmentDto(Integer id,Integer segmentId,Integer lineId,Integer patientId, String patientName, LocalDateTime creationDate, String appointmentDescription, LocalDateTime startTime, LocalDateTime endTime,
                                 AppointmentStatus status,String createdBy, String canceledBy,Integer appointmentLocationPlantId,String appointmentLocationPlantName,String patientPlantWorkingPlaceName) {


}
