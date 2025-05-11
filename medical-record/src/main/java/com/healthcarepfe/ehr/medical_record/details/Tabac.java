package com.healthcarepfe.ehr.medical_record.details;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tabac {
    private TabacStatus tabacStatus;
    private int nbCigaretteParJour;
    private LocalDate exFumerDate;
}
