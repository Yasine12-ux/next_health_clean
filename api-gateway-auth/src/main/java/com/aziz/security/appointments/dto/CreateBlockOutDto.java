package com.aziz.security.appointments.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record CreateBlockOutDto(LocalDate startDate, LocalDate endDate, String startTime, String endTime) {
}
