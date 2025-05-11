package com.aziz.security.medical_record.client.dto;

import com.aziz.security.medical_record.GroupeSanguin;
import com.aziz.security.medical_record.TabacStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Builder;


@Builder
@JsonIgnoreProperties
public record FichePatientDto(Integer userId, Integer tailleCm, Float poidsKg, GroupeSanguin groupeSanguin, float IMC,
                              String nom, String prenom, String dateNaissance, int age, String sexe, String lieuNaissance, String cin, String numTel, String adresse,// FicheAdministrative
                              boolean HTA, boolean diabete, boolean dyslipidemie, String autresAntecedentsFamiliaux,// AntecedentsFamiliaux
                              int nbGrossesse, int nbEnfantsVivants, int nbMacrosomies, int nbAvortements, int nbMortNes, String contraceptionUtilisee, int ageMenopause, String autresAntecedentsGynecoObstetriques,// AntecedentsGynecoObstetriques;
                              int alcoolSemaine, TabacStatus tabacStatus, int nbCigaretteParJour, String exFumerDate, boolean drogue, String autreHabitudeToxique// HabitudesToxiques
) {
}