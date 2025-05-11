package com.healthcarepfe.ehr.medical_record.services_controllers;

import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.Dto.FichePatientDto;
import com.healthcarepfe.ehr.medical_record.details.*;
import com.healthcarepfe.ehr.medical_record.details.dto.*;
import com.healthcarepfe.ehr.medical_record.repositories.DossierMedicalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdministrativeInformationService {
    private final DossierMedicalRepository dossierMedicalRepository;

    ResponseEntity<?> getAllFichePatient() {
        return ResponseEntity.ok(dossierMedicalRepository.findAll()
                .stream()
                .map(FichePatientDto::fromDossierMedicalDto).toList());
    }
    ResponseEntity<?> initFichePatient(Integer userId) {
        MedicalRecord medicalRecord = MedicalRecord.builder()
                .userId(userId)
                .tailleCm(0)
                .poidsKg(0)
                .ficheAdministrative(new FicheAdministrative())
                .antecedentsFamiliaux(new AntecedentsFamiliaux())
                .antecedentsGynecoObstetriques(new AntecedentsGynecoObstetriques())
                .habitudesToxiques(new HabitudesToxiques(
                        0,
                        new Tabac(),
                        false,
                        ""
                ))
                .consultations(new ArrayList<>())  // Initialize as empty list
                .vaccinations(new ArrayList<>())   // Initialize as empty list
                .build();
        medicalRecord = dossierMedicalRepository.save(medicalRecord);
        return ResponseEntity.ok(FichePatientDto.fromDossierMedicalDto(medicalRecord));
    }

    @Deprecated
    public ResponseEntity<?> createFichePatient(FichePatientDto fichePatientDto) {
        if(dossierMedicalRepository.existsById(fichePatientDto.userId()))
            return ResponseEntity.badRequest().body("User already has a fiche patient");

        MedicalRecord medicalRecord = MedicalRecord.builder()
                .userId(fichePatientDto.userId())
                .tailleCm(fichePatientDto.tailleCm())
                .poidsKg(fichePatientDto.poidsKg())
                .groupeSanguin(fichePatientDto.groupeSanguin())
                .ficheAdministrative(new FicheAdministrative(
                        null,
                        fichePatientDto.nom(),
                        fichePatientDto.prenom(),
                        (fichePatientDto.dateNaissance() != null && !fichePatientDto.dateNaissance().isEmpty()) ? LocalDate.parse(fichePatientDto.dateNaissance()) : null,
                        0,
                        fichePatientDto.sexe(),
                        fichePatientDto.lieuNaissance(),
                        fichePatientDto.cin(),
                        fichePatientDto.numTel(),
                        fichePatientDto.adresse()
                ))
                .antecedentsFamiliaux(new AntecedentsFamiliaux(
                        fichePatientDto.HTA(),
                        fichePatientDto.diabete(),
                        fichePatientDto.dyslipidemie(),
                        fichePatientDto.autresAntecedentsFamiliaux()
                ))
                .antecedentsGynecoObstetriques(new AntecedentsGynecoObstetriques(
                        fichePatientDto.nbGrossesse(),
                        fichePatientDto.nbEnfantsVivants(),
                        fichePatientDto.nbMacrosomies(),
                        fichePatientDto.nbAvortements(),
                        fichePatientDto.nbMortNes(),
                        fichePatientDto.contraceptionUtilisee(),
                        fichePatientDto.ageMenopause(),
                        fichePatientDto.autresAntecedentsGynecoObstetriques()
                ))
                .habitudesToxiques(new HabitudesToxiques(
                        fichePatientDto.alcoolSemaine(),
                        new Tabac(
                                fichePatientDto.tabacStatus(),
                                fichePatientDto.nbCigaretteParJour(),
                                (fichePatientDto.exFumerDate() != null && !fichePatientDto.exFumerDate().isEmpty()) ? LocalDate.parse(fichePatientDto.exFumerDate()) : null
                        ),
                        fichePatientDto.drogue(),
                        fichePatientDto.autreHabitudeToxique()
                ))
                .consultations(new ArrayList<>())  // Initialize as empty list
                .vaccinations(new ArrayList<>())   // Initialize as empty list
                .build();
        medicalRecord = dossierMedicalRepository.save(medicalRecord);
        return ResponseEntity.ok(FichePatientDto.fromDossierMedicalDto(medicalRecord));
    }
    ResponseEntity<?> updateFichePatient(FichePatientDto fichePatientDto){
        Optional<MedicalRecord> user = dossierMedicalRepository.findById(fichePatientDto.userId());
        Optional<MedicalRecord> patientCin = dossierMedicalRepository.findByFicheAdministrativeCin(fichePatientDto.cin());
            if ( patientCin.isPresent() && patientCin.get().getUserId()!=fichePatientDto.userId())
return ResponseEntity.badRequest().body("CIN existe déjà");


            MedicalRecord medicalRecord = dossierMedicalRepository.findById(fichePatientDto.userId()).orElseThrow();
        FichePatientDto.fromFichePatient(fichePatientDto, medicalRecord);
        return ResponseEntity.ok(FichePatientDto.fromDossierMedicalDto(dossierMedicalRepository.save(medicalRecord)));
    }


    ResponseEntity<?> getFichePatient(Integer userId) {
        var dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if(dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();
        MedicalRecord medicalRecord = dossierMedicalOptional.get();
        return ResponseEntity.ok(FichePatientDto.fromDossierMedicalDto(medicalRecord));
    }


    public ResponseEntity<?> getdossierTable(Integer userId) {
        var dossierMedicalOptional = dossierMedicalRepository.findById(userId);
        if(dossierMedicalOptional.isEmpty())
            return ResponseEntity.notFound().build();
        MedicalRecord medicalRecord = dossierMedicalOptional.get();
               int totalConsult=    medicalRecord.getConsultations().size();
        int totalExamenSize = 0;
        for (Consultation consultation : medicalRecord.getConsultations()) {
            totalExamenSize += consultation.getExamen().size();
        }
                     int totalOrdonnanceSize = 0;
for (Consultation consultation  : medicalRecord.getConsultations()) {
    if (Objects.nonNull(consultation.getOrdonnance()) )
    totalOrdonnanceSize += 1;
}
    if(medicalRecord.getFicheAdministrative()==null)
            medicalRecord.setFicheAdministrative(new FicheAdministrative());

        return ResponseEntity.ok(dossierTableDto.ConvertTo(medicalRecord.getUserId(), medicalRecord.getFicheAdministrative().getNom(), medicalRecord.getFicheAdministrative().getPrenom(),totalOrdonnanceSize,totalConsult,totalExamenSize,medicalRecord.getGroupeSanguin()));
    }


}
