import {Component, Input, OnInit} from '@angular/core';
import {DashboardService} from "../../service/dashboard.service";
import {AppointmentStatus, AppointmentStatusInFr} from "../../../models/AppointmentResponse";

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrl: './simple-card.component.css'
})
export class SimpleCardComponent implements OnInit{
  @Input() last30DaysAppointments = 0;
  @Input() last30DaysAppointmentsChange = '+25%';
  @Input() status:AppointmentStatus.CANCELLED|AppointmentStatus.COMPLETED|undefined

  constructor() {}

  ngOnInit(): void {
  }


  protected readonly AppointmentStatusInFr = AppointmentStatusInFr;
  protected readonly AppointmentStatus = AppointmentStatus;
  protected readonly Number = Number;
}
