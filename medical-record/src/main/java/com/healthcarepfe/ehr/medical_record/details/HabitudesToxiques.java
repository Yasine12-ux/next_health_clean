package com.healthcarepfe.ehr.medical_record.details;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HabitudesToxiques {
    private int alcoolSemaine;
    @Embedded
    private Tabac tabac;
    private boolean drogue;
    private String autreHabitudeToxique;
}
