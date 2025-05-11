package com.healthcarepfe.ehr.medical_record.details;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
public class Ordonnance {
    @GeneratedValue
    @Id
    private int id;
    private LocalDateTime date;
    private String catergorie;
    private String description;
}
