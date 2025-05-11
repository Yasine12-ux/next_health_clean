import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FichePatientSimpleResponse} from "../models/FichePatientSimpleResponse";
import {environment} from "../../../environments/environment";
import {FichePatientResponse} from "../models/FichePatientResponse";

@Injectable({
  providedIn: 'root'
})
export class FichePatientService {
  private baseUrl = environment.apiUrlDossierMedical

  constructor(private http:HttpClient) { }

  public getAllFichePatient(){
    return this.http.get<FichePatientResponse[]>(this.baseUrl + "/all");
  }
  public getAllFullFichePatient(){
    return this.http.get<FichePatientResponse[]>(this.baseUrl + "/all");
  }
}
