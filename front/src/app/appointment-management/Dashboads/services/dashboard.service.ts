import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashbordService {
  private baseUrl = environment.apiUrlDashboard
  constructor(private http:HttpClient) { }
  getAllPatientBylineManager(){
    return this.http.get(`${this.baseUrl}/all-line`)
  }
  getAllPatientBySegmentManager(){
    return this.http.get(`${this.baseUrl}/all-segment`)
  }
  getAllPatientByPsManager(){
    return this.http.get(`${this.baseUrl}/all-ps`)
  }
  getAllPatientByplantManager(){
    return this.http.get(`${this.baseUrl}/all-plant`)
  }
}
