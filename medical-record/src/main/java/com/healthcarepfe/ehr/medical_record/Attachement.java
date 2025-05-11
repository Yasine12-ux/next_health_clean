package com.healthcarepfe.ehr.medical_record;

import com.healthcarepfe.ehr.medical_record.details.Consultation;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
public class Attachement {
    public Attachement(byte[] attachement){
        this.attachement=attachement;
    }

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    Integer id;

    private byte[] attachement;

    @ManyToOne
    private Consultation consultation;

}
