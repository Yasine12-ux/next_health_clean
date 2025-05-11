package com.healthcarepfe.ehr.medical_record.details;

import com.healthcarepfe.ehr.medical_record.Image;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FicheAdministrative {
    @OneToOne
    private Image patientImage;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    @Transient
    private int age;
    private String sexe;
    private String lieuNaissance;
    @Column(unique = true)
    private String cin;
    private String numTel;
    private String adresse;
    public int CalculateAge(){
        if(dateNaissance==null)
            return 0;
        return LocalDate.now().getYear()-dateNaissance.getYear();
    }
}
