package com.healthcarepfe.ehr.medical_record.details;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Courrier{
    @Id
    private  Integer id;
    private LocalDate creationDate;
    private String destinataire;
    private String description;
}
