import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppointmentResponse} from "../models/AppointmentResponse";
import {ALL_RDV, AppointmentManagementTableService} from "../services/tables/appointment-management-table.service";
import {AppointmentsService} from "../services/appointments.service";
import {fr} from 'date-fns/locale'
import {format, parseISO} from "date-fns";
import {Router} from "@angular/router";
@Component({
  selector: 'app-appointment-header',
  templateUrl: './appointment-header.component.html',
  styleUrl: './appointment-header.component.css'
})
export class AppointmentHeaderComponent implements OnInit{
  selectedDate:string
  @ViewChild('dateInput') dateInput!: ElementRef;

  constructor(
    public appointmentManagementTableService:AppointmentManagementTableService,
    private appointmentsService:AppointmentsService,
    public router: Router
  ) {
    this.selectedDate= new Date().toISOString().substring(0, 10);
  }

  ngOnInit() {
    this.appointmentManagementTableService.setSelectedDate(this.selectedDate)
  }


  adjustDate(days: number) {
    this.selectedDate = addDays(this.selectedDate,days)
    this.appointmentManagementTableService.setSelectedDate(this.selectedDate)
  }
  getRelativeDate(date: string): string {
    const currentDate = new Date();
    const inputDate = new Date(date);

    // Get the difference in days
    const diffTime = inputDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays > 1 && diffDays <= 7) {
      return 'In ' + diffDays + ' days';
    } else if (diffDays < -1 && diffDays >= -7) {
      return Math.abs(diffDays) + ' days ago';
    } else {
      return date;
    }
  }
  formatDayName(dateString: string): string {
    const date = parseISO(dateString); // Convertir la chaîne en objet Date
    const formattedDayName = format(date, 'EEEE', { locale: fr });

    // Capitaliser la première lettre
    return formattedDayName.charAt(0).toUpperCase() + formattedDayName.slice(1);
  }

  // Fonction pour formater la date sans le nom du jour
  formatDateWithoutDay(dateString: string): string {
    const date = parseISO(dateString); // Convertir la chaîne en objet Date
    const formattedDate = format(date, 'MMMM d, yyyy', { locale: fr });

    return formattedDate;
  }
  protected readonly alert = alert;
  protected readonly console = console;

  loadRDVs() {
    this.appointmentManagementTableService.setSelectedDate(this.selectedDate)
  }
}
export const addDays=(date:string,days:number)=>{
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + days);
    return currentDate.toISOString().substring(0, 10);

}
