package com.healthcarepfe.ehr.medical_record.Dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.details.*;
import lombok.Builder;

import java.time.LocalDate;

@JsonIgnoreProperties
@Builder
public record FichePatientDto(Integer userId, Integer tailleCm, Float poidsKg, GroupeSanguin groupeSanguin, float IMC,
                              String nom, String prenom, String dateNaissance, int age, String sexe, String lieuNaissance, String cin, String numTel, String adresse,// FicheAdministrative
                              boolean HTA, boolean diabete, boolean dyslipidemie, String autresAntecedentsFamiliaux,// AntecedentsFamiliaux
                              int nbGrossesse, int nbEnfantsVivants, int nbMacrosomies, int nbAvortements, int nbMortNes, String contraceptionUtilisee, int ageMenopause, String autresAntecedentsGynecoObstetriques,// AntecedentsGynecoObstetriques;
                              int alcoolSemaine, TabacStatus tabacStatus, int nbCigaretteParJour, String exFumerDate, boolean drogue, String autreHabitudeToxique// HabitudesToxiques
) {
    public static FichePatientDto fromDossierMedicalDto(MedicalRecord medicalRecord) {
        String dateNaissance = null;
        if (medicalRecord.getFicheAdministrative() != null) {
            if(medicalRecord.getFicheAdministrative().getDateNaissance() != null)
                dateNaissance = medicalRecord.getFicheAdministrative().getDateNaissance().toString();
        }
        String exFumerDate = null;
        if (medicalRecord.getHabitudesToxiques() != null) {
            if(medicalRecord.getHabitudesToxiques().getTabac() != null) {
                if(medicalRecord.getHabitudesToxiques().getTabac().getExFumerDate() != null)
                    exFumerDate = medicalRecord.getHabitudesToxiques().getTabac().getExFumerDate().toString();
            }
        }
        FicheAdministrative ficheAdministrative = medicalRecord.getFicheAdministrative();
        if(ficheAdministrative==null)
            ficheAdministrative=new FicheAdministrative();

        AntecedentsFamiliaux antecedentsFamiliaux = medicalRecord.getAntecedentsFamiliaux();
        if(antecedentsFamiliaux==null)
            antecedentsFamiliaux=new AntecedentsFamiliaux();

        AntecedentsGynecoObstetriques antecedentsGynecoObstetriques = medicalRecord.getAntecedentsGynecoObstetriques();
        if(antecedentsGynecoObstetriques==null)
            antecedentsGynecoObstetriques=new AntecedentsGynecoObstetriques();

        HabitudesToxiques habitudesToxiques= medicalRecord.getHabitudesToxiques();
        if(habitudesToxiques==null)
            habitudesToxiques=new HabitudesToxiques();

        if(habitudesToxiques.getTabac()==null)
            habitudesToxiques.setTabac(new Tabac());


        return new FichePatientDto(medicalRecord.getUserId(), medicalRecord.getTailleCm(), medicalRecord.getPoidsKg(), medicalRecord.getGroupeSanguin(), medicalRecord.IMC(),
                ficheAdministrative.getNom(), ficheAdministrative.getPrenom(), dateNaissance
                , ficheAdministrative.CalculateAge(), ficheAdministrative.getSexe(), ficheAdministrative.getLieuNaissance(), ficheAdministrative.getCin(), ficheAdministrative.getNumTel(), ficheAdministrative.getAdresse(),
                antecedentsFamiliaux.isHTA(), antecedentsFamiliaux.isDiabete(), antecedentsFamiliaux.isDyslipidemie(), antecedentsFamiliaux.getAutresAntecedentsFamiliaux(),
                antecedentsGynecoObstetriques.getNbGrossesse(), antecedentsGynecoObstetriques.getNbEnfantsVivants(), antecedentsGynecoObstetriques.getNbMacrosomies(), antecedentsGynecoObstetriques.getNbAvortements(), antecedentsGynecoObstetriques.getNbMortNes(),
                antecedentsGynecoObstetriques.getContraceptionUtilisee(), antecedentsGynecoObstetriques.getAgeMenopause(), antecedentsGynecoObstetriques.getAutresAntecedentsGynecoObstetriques(),
                habitudesToxiques.getAlcoolSemaine(), habitudesToxiques.getTabac().getTabacStatus(), habitudesToxiques.getTabac().getNbCigaretteParJour(),exFumerDate, habitudesToxiques.isDrogue(), habitudesToxiques.getAutreHabitudeToxique());
    }
    public static MedicalRecord fromFichePatient(FichePatientDto fichePatientDto, MedicalRecord medicalRecord){
        if(medicalRecord.getFicheAdministrative()==null)
            medicalRecord.setFicheAdministrative(new FicheAdministrative());
        if(medicalRecord.getAntecedentsFamiliaux()==null)
            medicalRecord.setAntecedentsFamiliaux(new AntecedentsFamiliaux());
        if(medicalRecord.getAntecedentsGynecoObstetriques()==null)
            medicalRecord.setAntecedentsGynecoObstetriques(new AntecedentsGynecoObstetriques());
        if(medicalRecord.getHabitudesToxiques()==null)
            medicalRecord.setHabitudesToxiques(new HabitudesToxiques());
        if(medicalRecord.getHabitudesToxiques().getTabac()==null)
            medicalRecord.getHabitudesToxiques().setTabac(new Tabac());

        medicalRecord.setTailleCm(fichePatientDto.tailleCm());
        medicalRecord.setPoidsKg(fichePatientDto.poidsKg());
        medicalRecord.setGroupeSanguin(fichePatientDto.groupeSanguin());

        medicalRecord.getFicheAdministrative().setNom(fichePatientDto.nom());
        medicalRecord.getFicheAdministrative().setPrenom(fichePatientDto.prenom());
        medicalRecord.getFicheAdministrative().setDateNaissance((fichePatientDto.dateNaissance() != null && !fichePatientDto.dateNaissance().isEmpty()) ? LocalDate.parse(fichePatientDto.dateNaissance()) : null);
        medicalRecord.getFicheAdministrative().setAge(fichePatientDto.age());
        medicalRecord.getFicheAdministrative().setSexe(fichePatientDto.sexe());
        medicalRecord.getFicheAdministrative().setLieuNaissance(fichePatientDto.lieuNaissance());
        medicalRecord.getFicheAdministrative().setCin(fichePatientDto.cin());
        medicalRecord.getFicheAdministrative().setNumTel(fichePatientDto.numTel());
        medicalRecord.getFicheAdministrative().setAdresse(fichePatientDto.adresse());
        medicalRecord.getAntecedentsFamiliaux().setHTA(fichePatientDto.HTA());
        medicalRecord.getAntecedentsFamiliaux().setDiabete(fichePatientDto.diabete());
        medicalRecord.getAntecedentsFamiliaux().setDyslipidemie(fichePatientDto.dyslipidemie());
        medicalRecord.getAntecedentsFamiliaux().setAutresAntecedentsFamiliaux(fichePatientDto.autresAntecedentsFamiliaux());
        medicalRecord.getAntecedentsGynecoObstetriques().setNbGrossesse(fichePatientDto.nbGrossesse());
        medicalRecord.getAntecedentsGynecoObstetriques().setNbEnfantsVivants(fichePatientDto.nbEnfantsVivants());
        medicalRecord.getAntecedentsGynecoObstetriques().setNbMacrosomies(fichePatientDto.nbMacrosomies());
        medicalRecord.getAntecedentsGynecoObstetriques().setNbAvortements(fichePatientDto.nbAvortements());
        medicalRecord.getAntecedentsGynecoObstetriques().setNbMortNes(fichePatientDto.nbMortNes());
        medicalRecord.getAntecedentsGynecoObstetriques().setContraceptionUtilisee(fichePatientDto.contraceptionUtilisee());
        medicalRecord.getAntecedentsGynecoObstetriques().setAgeMenopause(fichePatientDto.ageMenopause());
        medicalRecord.getAntecedentsGynecoObstetriques().setAutresAntecedentsGynecoObstetriques(fichePatientDto.autresAntecedentsGynecoObstetriques());
        medicalRecord.getHabitudesToxiques().setAlcoolSemaine(fichePatientDto.alcoolSemaine());
        medicalRecord.getHabitudesToxiques().getTabac().setTabacStatus(fichePatientDto.tabacStatus());
        medicalRecord.getHabitudesToxiques().getTabac().setNbCigaretteParJour(fichePatientDto.nbCigaretteParJour());
        medicalRecord.getHabitudesToxiques().getTabac().setExFumerDate((fichePatientDto.exFumerDate() != null && !fichePatientDto.exFumerDate().isEmpty()) ? LocalDate.parse(fichePatientDto.exFumerDate()) : null);
        medicalRecord.getHabitudesToxiques().setDrogue(fichePatientDto.drogue());
        medicalRecord.getHabitudesToxiques().setAutreHabitudeToxique(fichePatientDto.autreHabitudeToxique());

        return medicalRecord;
    }
}