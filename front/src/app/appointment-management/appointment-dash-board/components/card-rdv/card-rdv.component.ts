import {Component, Input, OnInit} from '@angular/core';
import ApexCharts from "apexcharts";
import {DashboardService} from "../../service/dashboard.service";

@Component({
  selector: 'app-card-rdv',
  templateUrl: './card-rdv.component.html',
  styleUrl: './card-rdv.component.css'
})
export class CardRDVComponent implements OnInit{
  constructor(
    private DashboardService:DashboardService
  ) {
  }
  chart:any;
  data:number[] = []

  totalAppointments = 0;
  totalAppointmentsChange = '0%';

  ngOnInit() {
    this.DashboardService.getDataBS().subscribe(data=>{
      const thisWeekData = this.DashboardService.getThisWeekData(data)
      const nbAppointmentsByDay = this.DashboardService.getNbAppointmentsByDay(thisWeekData,7)
      const lastWeekData = this.DashboardService.getLastWeekData(data);
      const lastWeekAppointments = lastWeekData.length;
      const thisWeekAppointments = thisWeekData.length;
      const change = thisWeekAppointments - lastWeekAppointments;
      if(lastWeekAppointments !== 0)
        this.totalAppointmentsChange = ((change / lastWeekAppointments) * 100).toFixed(2) + '%';

      this.data=nbAppointmentsByDay
      if(this.chart)
        this.chart.updateSeries([{
          data: this.data
        }])
      this.totalAppointments = thisWeekData.length
    })

    const options = {
      chart: {
        height: "100%",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        },
      },
      labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      series: [
        {
          name: "Rendez-vous",
          data: this.data,
          color: "lightblue",
        },
      ],
      xaxis: {


        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    }

    if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
      this.chart = new ApexCharts(document.getElementById("area-chart"), options);
      this.chart.render();
    }
  }




}
