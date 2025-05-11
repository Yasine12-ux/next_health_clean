package com.healthcarepfe.ehr.medical_record.details;

import com.healthcarepfe.ehr.medical_record.Attachement;
import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Consultation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    private int idAppointment;
    @ManyToOne
    private MedicalRecord medicalRecord;
    private LocalDateTime date;
    private String motif;
    private int poidsKg;
    private int tailleCm;
    private int pouls;
    private int tensionArterielle;

    @Column(length = 3_000_000)
    private String diagnostic;
    private Boolean complete;
    @OneToOne
    private Ordonnance ordonnance;
    @OneToOne
    private Courrier courrier;
    @OneToMany(mappedBy = "consultation",fetch = FetchType.LAZY)
    private List<Attachement> attachement=new ArrayList<>();
    @OneToMany(mappedBy = "consultation",fetch = FetchType.LAZY)
    private List<Examen> examen=new ArrayList<>();
}