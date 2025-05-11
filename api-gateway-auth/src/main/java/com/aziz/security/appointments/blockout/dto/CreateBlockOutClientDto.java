package com.aziz.security.appointments.blockout.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record CreateBlockOutClientDto(Integer plantId, LocalDate startDate, LocalDate endDate, LocalTime startTime, LocalTime endTime) {
}
