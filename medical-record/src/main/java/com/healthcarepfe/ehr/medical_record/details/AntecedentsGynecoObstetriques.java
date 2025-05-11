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
public class AntecedentsGynecoObstetriques {
    private int nbGrossesse;
    private int nbEnfantsVivants;
    private int nbMacrosomies;
    private int nbAvortements;
    private int nbMortNes;
    private String contraceptionUtilisee;
    private int ageMenopause;
    private String autresAntecedentsGynecoObstetriques;

}
