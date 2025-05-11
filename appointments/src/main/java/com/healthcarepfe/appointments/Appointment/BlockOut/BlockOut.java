package com.healthcarepfe.appointments.Appointment.BlockOut;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class BlockOut {
    @GeneratedValue
    @Id
    Integer id;
    Integer plantId;

    LocalDate startDate;
    LocalDate endDate;

    LocalTime startTime;
    LocalTime endTime;
}
