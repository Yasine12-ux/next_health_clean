package com.healthcarepfe.ehr.medical_record.details;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AntecedentsFamiliaux {
    private boolean HTA;
    private boolean diabete;
    private boolean dyslipidemie;
    private String autresAntecedentsFamiliaux;
}