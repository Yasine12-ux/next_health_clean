package com.healthcarepfe.appointments.Appointment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Entity
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Integer id;

    Integer patientId;
    LocalDateTime creationDate;
    String appointmentDescription ;
    LocalDateTime startTime;
    LocalDateTime endTime;

    Integer appointmentLocationPlantId;

    @Enumerated(value = EnumType.ORDINAL)
    AppointmentStatus status;

    Integer createdBy;
    Integer canceledBy;


}