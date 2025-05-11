import {AfterViewInit, Component, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import ApexCharts from 'apexcharts';
import Datepicker from 'flowbite-datepicker/Datepicker';
import {DashboardService} from "./service/dashboard.service";
import {AppointmentsService} from "../services/appointments.service";
import {AppointmentStatus} from "../models/AppointmentResponse";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import {DashbordService} from "../Dashboads/services/dashboard.service";


@Component({
  selector: 'app-appointment-dash-board',
  templateUrl: './appointment-dash-board.component.html',
  styleUrl: './appointment-dash-board.component.css'
})
export class AppointmentDashBoardComponent implements OnInit, AfterViewInit{

  constructor(
    private appointmentService:AppointmentsService,
    private dashboardService:DashboardService,
    private dashbordService:DashbordService,
    private router:Router,
    private tokenService:TokenStorageService
  ) {
  }



  last30DaysAppointmentsCancelled = 0;
  last30DaysAppointmentsCancelledChange = '+0%';

  last30DaysAppointmentsCompleted = 0;
  last30DaysAppointmentsCompletedChange = '+0%';
  getDatePlusMinusDays(days:number){
    let date = new Date()
    date.setDate(date.getDate()+days)
    return date
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    // test
    // this.appointmentService.getPsYearMonthCount(2024).subscribe(data=>{
    // })
    // this.appointmentService.getPlantMgYearMonthCount(2024).subscribe(data=>{
    // })

    this.getAllPatientBylineManager();

    initFlowbite()
    const date100DaysAgo= this.getDatePlusMinusDays(-100)
    const date30DaysAhead = this.getDatePlusMinusDays(30)
    this.appointmentService.findAllAppointmentsNurse(date100DaysAgo.toISOString().slice(0,10),date30DaysAhead.toISOString().slice(0,10)).subscribe(
      data=>{
        this.dashboardService.setDataBS(data)
        this.last30DaysAppointmentsCancelled=this.getCanceledNbRdv(-30,0,AppointmentStatus.CANCELLED)
        const previous30DaysAppointments = this.getCanceledNbRdv(-60,-30,AppointmentStatus.CANCELLED)
        if(previous30DaysAppointments) this.last30DaysAppointmentsCancelledChange= ((this.last30DaysAppointmentsCancelled - previous30DaysAppointments) / previous30DaysAppointments * 100).toFixed(2)+"%";

        this.last30DaysAppointmentsCompleted=this.getCanceledNbRdv(-30,0,AppointmentStatus.COMPLETED)
        const previous30DaysAppointmentsCompleted = this.getCanceledNbRdv(-60,-30,AppointmentStatus.COMPLETED)
        if(previous30DaysAppointmentsCompleted)this.last30DaysAppointmentsCompletedChange= ((this.last30DaysAppointmentsCompleted - previous30DaysAppointmentsCompleted) / previous30DaysAppointmentsCompleted * 100).toFixed(2)+"%";

      })

    /////

///////////////


    const getChartOptions3 = () => {
      return {
        series: [52.8, 26.8, 20.4],
        colors: ["#ffdc6a", "#fd5f5f", "#86fc7f"],
        chart: {
          height: "100%",
          width: "100%",
          type: "pie",
        },
        stroke: {
          colors: ["white"],
          lineCap: "",
        },
        plotOptions: {
          pie: {
            labels: {
              show: true,
            },
            size: "100%",
            dataLabels: {
              offset: -25
            }
          },
        },
        labels: ["Planifié","Annulé","Complete"],
        dataLabels: {
          enabled: false,
          style: {
            fontFamily: "Inter, sans-serif",
          },
        },
        legend: {
          position: "right",
          fontFamily: "Inter, sans-serif",
        },
        yaxis: {
          labels: {
            formatter: function (value:any) {
              return value + "%"
            },

          },
        },
        xaxis: {
          labels: {
            formatter: function (value:any) {
              return value  + "%"
            },
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
      }
    }

    if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("pie-chart"), getChartOptions3());
      chart.render();
    }

    ///////////////////



    //////////////////////

    }


  ///////////////


  protected readonly AppointmentStatus = AppointmentStatus;

  getCanceledNbRdv(start:number,end:number,status:AppointmentStatus) {
  return this.dashboardService.getNbRdvByStatusAndDateBetween(
        this.getDatePlusMinusDays(start).getTime(),
        this.getDatePlusMinusDays(end).getTime(),
        status,
        this.dashboardService.getDataBS().value
      )
  }
  checkUser()
  {
    if (this.router.url.includes('inf')) return true;
    return false;
  }









  LastWeek() {
    const today = new Date();
    //last week ----------------------
    const dayOfWeek = today.getDay();
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
    const lastMonday = new Date(today.setDate(diffToMonday - 7));
    const lastSunday = new Date(today.setDate(diffToMonday - 1)); // adjust to get last Saturday

    return { start: lastMonday, end: lastSunday };

    //this week ---------------------


  }
  getThisWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
  const thisMonday = new Date();
  thisMonday.setDate(diffToMonday);
  const thisSunday = new Date();
  thisSunday.setDate(diffToMonday + 6); // adjust to get this Saturday

  return { start: thisMonday, end: thisSunday };
}

totalPatient:any;

getAllPatientBylineManager() {
  const thisweek = this.getThisWeek();
  const lastweek = this.LastWeek();
  if (this.router.url.includes("rh")) {
    this.dashboardService.getDataBS().subscribe(
      (data: any) => {
        const thisWeekData = data.filter((item: any) => {
          const appointmentDate = new Date(item.startTime);
          return appointmentDate >= thisweek.start && appointmentDate <= thisweek.end;
        });

        const ids = thisWeekData.map((item: any) => item.patientId); // get all ids
        const uniqueIds = ids.filter((id: any, index: any) => ids.indexOf(id) === index);
        this.totalPatient = uniqueIds.length; // count unique ids
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}



}
