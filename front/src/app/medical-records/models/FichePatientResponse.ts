enum GroupeSanguin {
  A_POSITIF= 'A_POSITIF',
  A_NEGATIF= 'A_NEGATIF',
  B_POSITIF= 'B_POSITIF',
  B_NEGATIF= 'B_NEGATIF',
  AB_POSITIF= 'AB_POSITIF',
  AB_NEGATIF= 'AB_NEGATIF',
  O_POSITIF= 'O_POSITIF',
  O_NEGATIF= 'O_NEGATIF',
}
enum  TabacStatus {
  FUMEUR= 'FUMEUR',
  NON_FUMEUR= 'NON_FUMEUR',
  EX_FUMEUR= 'EX_FUMEUR',
}

export interface FichePatientResponse {
  userId: number;
  tailleCm: number;
  poidsKg: number;
  groupeSanguin: GroupeSanguin;
  IMC: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  age: number;
  sexe: string;
  lieuNaissance: string;
  cin: string;
  numTel: string;
  adresse: string;
  HTA: boolean;
  diabete: boolean;
  dyslipidemie: boolean;
  autresAntecedentsFamiliaux: string;
  nbGrossesse: number;
  nbEnfantsVivants: number;
  nbMacrosomies: number;
  nbAvortements: number;
  nbMortNes: number;
  contraceptionUtilisee: string;
  ageMenopause: number;
  autresAntecedentsGynecoObstetriques: string;
  alcoolSemaine: number;
  tabacStatus: TabacStatus;
  nbCigaretteParJour: number;
  exFumerDate: String;
  drogue: boolean;
  autreHabitudeToxique: string;
}

export const changeGroupS:{[key: string]: string} ={
  A_POSITIF: 'A+',
  A_NEGATIF:'A-',
  B_POSITIF:'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF:'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',

}
export const changeFumerStaus:{[key: string]: string} ={
  FUMEUR: 'Fumeur',
  NON_FUMEUR: 'Non fumeur',
  EX_FUMEUR: 'Ex fumeur',

}
