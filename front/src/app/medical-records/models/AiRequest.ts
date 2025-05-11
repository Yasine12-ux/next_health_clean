export interface AiRequest {
  taille_cm?: number;
  poids_kg?: number;
  groupe_sanguin?: string;
  imc?: number;
  adresse?: string;
  hta?: boolean;
  diabete?: boolean;
  dyslipidemie?: boolean;
  nb_grossesse?: number;
  nb_enfants_vivants?: number;
  nb_macrosomies?: number;
  nb_avortements?: number;
  nb_mort_nes?: number;
  age_menopause?: number;
  alcool_semaine?: number;
  tabac_status?: string;
  nb_cigarette_par_jour?: number;
  drogue?: boolean;
  age?: number;
  sexe?: string;
  diagnostic?: string;
  prescription?: string;
}
