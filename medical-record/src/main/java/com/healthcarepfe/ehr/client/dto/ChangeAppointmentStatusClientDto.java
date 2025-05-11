package com.healthcarepfe.ehr.client.dto;

import com.healthcarepfe.ehr.client.AppointmentStatus;

public record ChangeAppointmentStatusClientDto(Integer id, AppointmentStatus status, Integer idDoneBy) {
}
