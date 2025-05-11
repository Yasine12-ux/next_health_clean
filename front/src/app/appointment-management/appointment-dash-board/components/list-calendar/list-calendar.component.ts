import {Component, OnInit} from '@angular/core';
import Datepicker from "flowbite-datepicker/Datepicker";
import {AppointmentsService} from "../../../services/appointments.service";
import {AppointmentResponse, AppointmentStatus, AppointmentStatusInFr} from "../../../models/AppointmentResponse";
 @Component({
  selector: 'app-list-calendar',
  templateUrl: './list-calendar.component.html',
  styleUrl: './list-calendar.component.css'
})
export class ListCalendarComponent implements OnInit{

  constructor(
    private appointmentService:AppointmentsService,
  ) {
  }


  rdvList:AppointmentResponse[]=[]

  dataPicker:any
  lastSelectedDate:Date|null=null
  ngOnInit() {
     const datepickerEl = document.getElementById('datepickerId');
     this.dataPicker=new Datepicker(datepickerEl,
      {
      maxDate: new Date("2030-01-01"),
      minDate: new Date("1950-01-01"),

    });
     this.dataPicker.setDate(new Date())
      this.getDate()

  }
  getDate(){
    const newDate = this.dataPicker.getDate()
    if(newDate!==this.lastSelectedDate){
      const start =this.addDaysToDate(newDate,1)
      const end =  this.addDaysToDate(start,1)
      this.lastSelectedDate=newDate
      this.appointmentService.findAllAppointmentsNurse(start.toISOString().slice(0,10),end.toISOString().slice(0,10)).subscribe(
        data=>{
          this.rdvList=data
          if(this.rdvList!=null)
            this.rdvList=this.rdvList.slice(0,3)
        })

    }
  }
  addDaysToDate(date:Date,day:number){
    const newDate = new Date(date)
    newDate.setDate(date.getDate()+day)
    return newDate
  }
  protected readonly alert = alert;
   protected readonly AppointmentStatusInFr = AppointmentStatusInFr;


   colorByStatus={
      [AppointmentStatus.CANCELLED]:"text-red-700 bg-red-100 ring-red-600/20",
      [AppointmentStatus.SCHEDULED]:"text-yellow-700 bg-yellow-100 ring-yellow-600/20",
      [AppointmentStatus.COMPLETED]: "text-green-700 bg-green-100 ring-green-600/20"
   }
 }

