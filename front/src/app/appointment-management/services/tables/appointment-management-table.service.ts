import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {UserResponse} from "../../../models/user-response";
import {AppointmentResponse} from "../../models/AppointmentResponse";
import {addDays} from "../../appointment-header/appointment-header.component";
import {AppointmentsService} from "../appointments.service";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {Router} from "@angular/router";
import {permissionPages} from "../../../pages/components/side-bar/side-bar.component";


export const ALL_RDV = "all"
@Injectable({
  providedIn: 'root'
})
export class AppointmentManagementTableService {


  private _rdvBS = new BehaviorSubject<AppointmentResponse[]>([]);

  private _selectedDate =new BehaviorSubject<string>("")

  getRdvBS():BehaviorSubject<AppointmentResponse[]>{
    return this._rdvBS;
  }
  setRdvBS(data: AppointmentResponse[]) {
    this._rdvBS.next(data);
  }
  getSelectedDate():BehaviorSubject<string>{
    return this._selectedDate
  }
  setSelectedDate(date:string ){
    this._selectedDate.next(date)
  }
  constructor(
    private appointmentsService:AppointmentsService,
    private router:Router
  ) {

    this._selectedDate.subscribe(
      date=>{
        if(date== ALL_RDV)
          this.loadAll()
        else
          this.loadRDVs()
      }
    )
  }
  loadAll(){
    this.callLoadRdv("1700-01-01","3000-01-01").subscribe(
      (res: AppointmentResponse[]) => {
        if(res!=null)
          this.setRdvBS(res)
        else this.setRdvBS([])
      });
  }
  loadRDVs() {
    if (this.getSelectedDate().getValue() ===ALL_RDV) return;
    this.callLoadRdv(this.getSelectedDate().getValue(),addDays(this.getSelectedDate().getValue(),1)).subscribe(
      (res: AppointmentResponse[]) => {
        if(res!=null)
          this.setRdvBS(res)
        else this.setRdvBS([])
      });
  }

  addAppointment(res:AppointmentResponse){
    const newList =this.getRdvBS().getValue()
    newList.push(res)
    this._rdvBS.next(newList)
  }
  updateAppointment(res: AppointmentResponse) {
    const rdvs = this._rdvBS.value.map(row=>{
      if(row.id==res.id){
        return res;
      }
      return row;
    })
  this.setRdvBS(rdvs)
  }
  callLoadRdv(startDate:string,endDate:string) {
    return [permissionPages["RH_APPOINTMENT"], permissionPages["RH_APPOINTMENT"].replace("list", "calendar")].includes(this.router.url.substring(1))
      ? this.appointmentsService.findAllAppointmentsRH(startDate, endDate)
      : [permissionPages["DOCTOR_APPOINTMENT"], permissionPages["DOCTOR_APPOINTMENT"].replace("list", "calendar")].includes(this.router.url.substring(1))
        ? this.appointmentsService.findAllAppointmentsDoctor(startDate, endDate)
      : [permissionPages["NURSE_APPOINTMENT"], permissionPages["NURSE_APPOINTMENT"].replace("list", "calendar")].includes(this.router.url.substring(1))
        ? this.appointmentsService.findAllAppointmentsNurse(startDate, endDate)
        : permissionPages["LINE_MANAGER_APPOINTMENT"] == this.router.url.substring(1)
          ? this.appointmentsService.findAllAppointmentsLineManager(startDate, endDate)
          : this.appointmentsService.findAllAppointmentsSegmentManager(startDate, endDate)
  }
}
