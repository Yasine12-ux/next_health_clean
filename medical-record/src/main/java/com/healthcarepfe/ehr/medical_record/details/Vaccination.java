package com.healthcarepfe.ehr.medical_record.details;

import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Vaccination {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    @ManyToOne
    private MedicalRecord medicalRecord;
    private LocalDate date;
    private String vaccin;
}
