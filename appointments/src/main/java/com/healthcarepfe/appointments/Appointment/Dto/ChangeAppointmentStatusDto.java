package com.healthcarepfe.appointments.Appointment.Dto;

import com.healthcarepfe.appointments.Appointment.AppointmentStatus;
import org.springframework.web.bind.annotation.PathVariable;

public record ChangeAppointmentStatusDto(Integer id, AppointmentStatus status, Integer idDoneBy) {
}
