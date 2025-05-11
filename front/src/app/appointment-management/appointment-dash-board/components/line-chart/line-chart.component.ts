import {Component, OnInit} from '@angular/core';
import ApexCharts from "apexcharts";
import {DashboardService} from "../../service/dashboard.service";
import {AppointmentsService} from "../../../services/appointments.service";
import {TokenStorageService} from "../../../../services/auth-services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit{

  chart:any

  constructor(
    private dashboardService:DashboardService,
    private appointmentService:AppointmentsService,
    private tokenStorageService:TokenStorageService,
    private router:Router
  ) {
  }

  updateData() {
    if(this.router.url === '/home/inf/inf/dashboard'|| this.router.url === '/home/doctor/doctor/dashboard'){
    this.appointmentService.getNurseYearMonthCount(2024).subscribe(data=>{
      const data2 = this.dashboardService.getNbRdvOfYearByMonth(data)
      this.chart.updateSeries([{
        data: data2
      }])
    })}
    if(this.router.url === '/home/plantManager/plantManager/dashboard'){
    this.appointmentService.getPlantMgYearMonthCount(2024).subscribe(data=>{
      const data2 = this.dashboardService.getNbRdvOfYearByMonth(data)
      this.chart.updateSeries([{
        data: data2
      }])
    })}
    if(this.router.url === '/home/psManager/psManager/dashboard' ){
    this.appointmentService.getPsYearMonthCount(2024).subscribe(data=>{
      const data2 = this.dashboardService.getNbRdvOfYearByMonth(data)
      this.chart.updateSeries([{
        data: data2
      }])
    })
    }
  }

  ngOnInit() {
    this.updateData()
    const options = {
      chart: {
        height: "300px",
        width: "100%",
        type: "bar",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadiusApplication: "end",
          borderRadius: 8,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        curve: 'smooth'

      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 20,
          right: 2,
          top: -26
        },
      },
      series: [
        {
          name: "Rdv",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
          color: "#1b51cb",
        },
      ],
      legend: {
        show: false
      },
      xaxis: {
        categories: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500'
          }
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

    if (document.getElementById("line-chart2") && typeof ApexCharts !== 'undefined') {
      this.chart = new ApexCharts(document.getElementById("line-chart2"), options);
      this.chart.render();
    }
  }
}
