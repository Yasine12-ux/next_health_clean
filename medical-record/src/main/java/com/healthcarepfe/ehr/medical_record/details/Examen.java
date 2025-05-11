package com.healthcarepfe.ehr.medical_record.details;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Examen {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    LocalDateTime date;
    String resultat;
    String type;
    String regionExamenee;
    @ManyToOne
    private Consultation consultation;
}
