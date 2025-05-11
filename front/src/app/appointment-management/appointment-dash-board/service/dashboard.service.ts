import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {BlockOutResponse} from "../../models/BlockOutResponse";
import {AppointmentResponse, AppointmentStatus} from "../../models/AppointmentResponse";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _dataBS = new BehaviorSubject<AppointmentResponse[]>([]);
  constructor() {

  }

  getDataBS():BehaviorSubject<AppointmentResponse[]>{
    return this._dataBS;
  }
  setDataBS(data: AppointmentResponse[]) {

    this._dataBS.next(data);
  }


  getThisYearDataByMonth(appointments:AppointmentResponse[]){
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate >= startOfYear && appointmentDate <= endOfYear;
    });
  }


  getLastWeekData(appointments:AppointmentResponse[]){
  const today = new Date();
  const startOfLastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
  const endOfLastWeek = new Date(startOfLastWeek.getFullYear(), startOfLastWeek.getMonth(), startOfLastWeek.getDate() + 7);

  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return appointmentDate >= startOfLastWeek && appointmentDate < endOfLastWeek;
  });
}

  getThisWeekData(appointments:AppointmentResponse[]){
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7);

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate >= startOfWeek && appointmentDate < endOfWeek;
    });
  }

  getNbAppointmentsByDay(thisWeekData: AppointmentResponse[],length:number) {
    const nbAppointmentsByDay = new Array(length).fill(0)
    thisWeekData.forEach(appointment=>{
      const appointmentDate = new Date(appointment.startTime)
      const day = appointmentDate.getDay()
      nbAppointmentsByDay[day]++
    })
    return nbAppointmentsByDay
  }
  getNbRdvByStatusAndDateBetween(start:number,end:number,status:AppointmentStatus,data: AppointmentResponse[]) {
    let startDate = new Date(start)
    let endDate = new Date(end)

    return data.filter(appointment=>{
      const appointmentDate = new Date(appointment.startTime)
      return appointmentDate >= startDate && appointmentDate <= endDate && appointment.status === status
    }).length

  }
  getNbRdvByDateBetweenGroupedByPlantName(start:number,end:number,data: AppointmentResponse[]) {
    let startDate = new Date(start)
    let endDate = new Date(end)

    return data.filter(appointment=>{
      const appointmentDate = new Date(appointment.startTime)
      return appointmentDate >= startDate && appointmentDate <= endDate
    }).reduce((acc:{[key:string]:number},appointment)=> {
      if (acc[appointment.patientPlantWorkingPlaceName]) acc[appointment.patientPlantWorkingPlaceName]++
      else acc[appointment.patientPlantWorkingPlaceName] = 1

      return acc
    },{})
  }

  getNbRdvOfYearByMonth(data:[]) {
    const nbAppointmentsByMonth = new Array(12).fill(0)
    data.forEach((month:[number,string])=>{
      const monthIndex = month[1]
      const nbAppointments = month[0]
      nbAppointmentsByMonth[Number(monthIndex)-1] = nbAppointments
    })
    return nbAppointmentsByMonth

  }
}
