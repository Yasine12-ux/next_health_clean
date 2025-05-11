import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppointmentResponse, AppointmentStatus} from "../models/AppointmentResponse";
import {AppointmentRequest} from "../models/AppointmentRequest";
import {StructureMiniResponse} from "../../structures/models/StructureMiniResponse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private baseUrl = environment.apiUrlAppointments

  constructor(private http:HttpClient) { }


  findAllAppointmentsRH(startDate:string,endDate:string){
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/all-rh/${startDate}/${endDate}`)
  }
  findAllAppointmentsNurse(startDate:string,endDate:string){
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/all-nurse/${startDate}/${endDate}`)
  }
  findAllAppointmentsLineManager(startDate:string,endDate:string){
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/all-line-manager/${startDate}/${endDate}`)
  }
  findAllAppointmentsSegmentManager(startDate:string,endDate:string){
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/all-segment-manager/${startDate}/${endDate}`)
  }

  findAllAppointmentsDoctor(startDate:string,endDate:string){
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/all-doctor/${startDate}/${endDate}`)
  }

    changeAppointmentStatus(id: number, status: string){
    return this.http.put<AppointmentResponse>(`${this.baseUrl}/status/${id}/${status}`,{})
  }

  getAvailableDates(date:string,plantId:number){
    return this.http.get<string[]>(`${this.baseUrl}/available-times/${date}/${plantId}`)
  }

  createAppointment(data:AppointmentRequest){
    return this.http.post<AppointmentResponse>(`${this.baseUrl}/book`,data)
  }

  getNursePlant(){
    return this.http.get<StructureMiniResponse>(`${this.baseUrl}/nurse-plant`)
  }
  getNurseYearMonthCount(year:number){
    return this.http.get<[]>(`${this.baseUrl}/year-nb-rdvs/${year}`)
  }
  getPsYearMonthCount(year:number){
    return this.http.get<[]>(`${this.baseUrl}/year-nb-rdvs-ps-mg/${year}`)
  }
  getDoctorYearMonthCount(year:number){
    return this.http.get<[]>(`${this.baseUrl}/year-nb-rdvs-doctor/${year}`)
  }
  getPlantMgYearMonthCount(year:number){
    return this.http.get<[]>(`${this.baseUrl}/year-nb-rdvs-plant-mg/${year}`)
  }


}
