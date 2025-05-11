import {ConsultationResponse} from "./ConsultationResponse";
import { OrdonnanceResponse } from "./OrdonnanceResponse";
import {ExamenResponse} from "./ExamenResponse";

export interface FullConsultationResponse {
  doctorId?:string,
  consultation: ConsultationResponse;
  ordonnance?: OrdonnanceResponse;
  examens?: ExamenResponse[];
}
