export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export const AppointmentStatusInFr:{[key:string]:string}={
  "SCHEDULED":"Planifié",
  "COMPLETED":"Completé",
  "CANCELLED" : "Annulé",

}

export interface AppointmentResponse {
  "id": number,
  "segmentId": number,
  "lineId": number,
  "patientName": string,
  "patientId":number,
  "creationDate": string,
  "appointmentDescription": string,
  "startTime": string,
  "endTime": string,
  "status": AppointmentStatus,
  "createdBy": string,
  "canceledBy"?: string,
  "appointmentLocationPlantId":number,
  "appointmentLocationPlantName":string,
  "patientPlantWorkingPlaceName":string,

}
