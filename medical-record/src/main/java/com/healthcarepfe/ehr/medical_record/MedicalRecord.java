package com.healthcarepfe.ehr.medical_record;


import com.healthcarepfe.ehr.medical_record.details.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    @Id
    private int userId;

    @Embedded
    private FicheAdministrative ficheAdministrative;

    @Embedded
    private AntecedentsFamiliaux antecedentsFamiliaux;

    @Embedded
    private AntecedentsGynecoObstetriques antecedentsGynecoObstetriques;

    @OneToMany(mappedBy = "medicalRecord", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Consultation> consultations = new ArrayList<>();

    @OneToMany(mappedBy = "medicalRecord", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vaccination> vaccinations = new ArrayList<>();

    private int tailleCm;
    private float poidsKg;

    @Enumerated(EnumType.STRING)
    private GroupeSanguin groupeSanguin;

    public float IMC() {
        if (tailleCm == 0) return 0;
        double tailleM = tailleCm / 100.0;
        return (float) (poidsKg / (tailleM * tailleM));
    }
    @Embedded
    private HabitudesToxiques habitudesToxiques;
}
