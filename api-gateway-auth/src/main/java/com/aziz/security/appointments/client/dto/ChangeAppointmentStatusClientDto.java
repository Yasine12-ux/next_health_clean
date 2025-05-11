package com.aziz.security.appointments.client.dto;


import com.aziz.security.appointments.client.AppointmentStatus;

public record ChangeAppointmentStatusClientDto(Integer id, AppointmentStatus status, Integer idDoneBy) {
}
