import {Component, OnInit} from '@angular/core';
import {FichePatientService} from "../../../../medical-records/service/fiche-patient.service";
import {FichePatientResponse} from "../../../../medical-records/models/FichePatientResponse";

@Component({
  selector: 'app-radial-chart',
  templateUrl: './radial-chart.component.html',
  styleUrls: ['./radial-chart.component.css']
})
export class RadialChartComponent implements OnInit {

  totalPatient: number = 0;

  constructor(private fichePatientService: FichePatientService) { }

  ngOnInit() {
    this.fichePatientService.getAllFullFichePatient().subscribe((data: FichePatientResponse[]) => {
      const ageIntervals = this.processAges(data);
      this.renderChart(ageIntervals);
    });
  }

  calculateAge(dateNaissance: string) {
    if (!dateNaissance) return null;
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  processAges(data: FichePatientResponse[]): number[] {
    const intervals = [0, 0, 0]; // [0-20, 21-40, 41-60]
    data.forEach(patient => {
      const age = this.calculateAge(patient.dateNaissance);
      if (!age) return;
      if (age <= 20) {
        intervals[0]++;
      } else if (age <= 40) {
        intervals[1]++;
      } else if (age <= 60) {
        intervals[2]++;
      }
    });

    return intervals;
  }



    renderChart(series: number[]) {
      const chartOptions = {
        series: series,
        colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
        chart: {
          height: 350,
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
        labels: ["0-20", "21-40", "41-60"],
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Inter, sans-serif",
          },
        },
        legend: {
          position: "bottom",
          fontFamily: "Inter, sans-serif",
        },
        yaxis: {
          labels: {
            formatter: function (value: any) {

              return value +" patients";
            }
          }
        },
        xaxis: {
          labels: {
            formatter: function (value: any) {

              return value +" patients";
            }

          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
      };
    if (document.getElementById("radial-chart-age") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.querySelector("#radial-chart-age"), chartOptions);
      chart.render();
    }
  }
}
