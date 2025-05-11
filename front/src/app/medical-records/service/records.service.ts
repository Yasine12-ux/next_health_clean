import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ConsultationResponse} from "../models/ConsultationResponse";
import {OrdonnanceResponse} from "../models/OrdonnanceResponse";
import {ExamenResponse} from "../models/ExamenResponse";
import {FullConsultationResponse} from "../models/FullConsultationResponse";
import {environment} from "../../../environments/environment";
import {FichePatientResponse} from "../models/FichePatientResponse";

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private baseUrlAttach = environment.apiUrlAttachments
  private baseUrlDossier = environment.apiUrlDossierMedical
 private baseUrlUser = environment.apiUrlUsers
  private baseUrlConsult=environment.apiUrlConsultation
  private baseUrlOrdonnance=environment.apiUrlOrdonnance
  private baseUrlExamen=environment.apiUrlExamen
  constructor(private http:HttpClient) { }


  getAttachment(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrlAttach}get-attachments/${id}`, { observe: 'response', responseType: 'blob' });
  }
  public uploadAttachement(formData: FormData){
  return this.http.post(this.baseUrlAttach + "upload-attachments", formData);
}

  public getFichePatient(id: string): Observable<any> {
    return this.http.get<FichePatientResponse>(this.baseUrlDossier+`/${id}`);
  }

  public updateFichePatient(data: any): Observable<any> {
    return this.http.put(this.baseUrlDossier+"/update", data)
  }


  getImage(id: string) {
    return this.http.get(`${this.baseUrlUser}/get-imageId/${id}`, { responseType: 'blob' });
  }

  uploadImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('email', id);
    formData.append('image', file);

    return this.http.post(`${this.baseUrlUser}/upload-imageId/${id}`, formData);

  }

  changeImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.put(`${this.baseUrlUser}/change-imageid/${id}`, formData);
  }

  getAllConsult(id:string)
  {
    return this.http.get<ConsultationResponse[]>(`${this.baseUrlConsult}/all/${id}`);

  }
  getConsultation(id:string)
  {
    return this.http.get<ConsultationResponse>(`${this.baseUrlConsult}/${id}`);
  }
  getFullConsultation(id:string)
  {
    return this.http.get<FullConsultationResponse>(`${this.baseUrlConsult}/full/${id}`);
  }

  creeConsultation(idPatient: number, data: ConsultationResponse){
    return this.http.post<ConsultationResponse>(`${this.baseUrlConsult}/create/${idPatient}`, data);
  }

  getOrCreateByAppointment(idAppointment: number,idPatient: number,data: ConsultationResponse){
    return this.http.post<ConsultationResponse>(`${this.baseUrlConsult}/get-or-create/${idAppointment}/${idPatient}`, data);
  }

  getAllOrdonnancebyPatient(id:string){
    return this.http.get<OrdonnanceResponse[]>(`${this.baseUrlOrdonnance}/all/${id}`);
  }

  getAllExamenbyPatient(id:string) {
    return this.http.get<ExamenResponse[]>(`${this.baseUrlExamen}/all/${id}`);
  }

  getDossierTable(id:string) {
    return this.http.get<any>(`${this.baseUrlDossier}/table/${id}`);
  }
  saveFullConsultation(data: FullConsultationResponse){
    return this.http.post<FullConsultationResponse>(`${this.baseUrlConsult}/save-full-consultation`, data);

  }

  createExamen(consltId: number, data: ExamenResponse){
    return this.http.post<ExamenResponse>(`${this.baseUrlDossier}/examen/create/${consltId}`, data);
  }

  updateExamen(data: ExamenResponse){
    return this.http.put<ExamenResponse>(`${this.baseUrlDossier}/examen/update`, data);
  }
}
