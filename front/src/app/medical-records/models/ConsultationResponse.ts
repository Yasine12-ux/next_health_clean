export interface ConsultationResponse {
  id?: number;
  idPatient?: number;
  patientFullName?: string;
  idAppointment?: number;
  date?: string;
  motif?: string;
  poidsKg?: number;
  tailleCm?: number;
  pouls?: number;
  tensionArterielle?: number;
  diagnostic?: string;
  complete?: boolean;
}
