import {Component, OnInit} from '@angular/core';
import ApexCharts from "apexcharts";
import {DashboardService} from "../../service/dashboard.service";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent implements OnInit{
  constructor(private dashboardService:DashboardService) {
  }
  chart:any
  options={}
  ngOnInit() {
this.dashboardService.getDataBS().subscribe(data => {

  const x: { [key: string]: number } = this.dashboardService.getNbRdvByDateBetweenGroupedByPlantName(new Date().getTime() - 1000 * 60 * 60 * 24 * 30, new Date().getTime(), data);

  // Update labels and series
  this.options = {
    ...this.options,
    labels: Object.keys(x),
    series: Object.values(x)
  };

  // Update chart options
  if (this.chart)
    this.chart.updateOptions(this.options);
});
    this.options= {
      series: [35.1, 23.5, 2.4, 5.4],
      colors: ["lightgreen", "#16BDCA", "#fccaa7", "#fd80be"],
      chart: {
        height: "100%",
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,

              },
              total: {

                show: true,
                // label: "Rendez-vous",
                fontFamily: "Inter, sans-serif",

                formatter: function (w:any) {
                  const sum = w.globals.seriesTotals.reduce((a:any, b:any) => {
                    return a + b
                  }, 0)
                  return sum
                },
              },

              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value:any) {
                  return value
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["Tunis", "Mater", "Manzel Hayet", "Sfax"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "right",
        fontFamily: "Inter, sans-serif",
        show: false,
        // max 2 items
      },
      yaxis: {
        labels: {
          formatter: function (value:any) {
            return value
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value:any) {
            return value
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
    const getChartOptions2= () => {
      return this.options
    }

    if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
      this.chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions2());
      this.chart.render();
    }
  }
}
