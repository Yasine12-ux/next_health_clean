import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FichePatientService } from "../../../../medical-records/service/fiche-patient.service";
import { FichePatientResponse } from "../../../../medical-records/models/FichePatientResponse";

@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-chart.component.html',
  styleUrls: []
})
export class PieChartsComponent implements OnInit {
 public totalPatient:number=0
  constructor(private fichePatientService: FichePatientService) { }

  ngOnInit(): void {
    initFlowbite();
    this.fichePatientService.getAllFullFichePatient().subscribe((data: FichePatientResponse[]) => {
      const healthDetails = this.processHealthDetails(data);
      this.renderChart(healthDetails);
    });
  }

  processHealthDetails(data: FichePatientResponse[]): string[] {
    let diabetesCount = 0;
    let dyslipidemiaCount = 0;
    let htaCount = 0;
    let toxicHabitsCount = 0;
this.totalPatient=data.length
    data.forEach(patient => {
      if (patient.sexe === 'Homme') { // Updated the gender check to "Homme"
        if (patient.diabete) diabetesCount++;
        if (patient.dyslipidemie) dyslipidemiaCount++;
        if (patient.HTA) htaCount++;
        if (patient.tabacStatus !== 'NON_FUMEUR' || patient.alcoolSemaine > 0 || patient.drogue) toxicHabitsCount++;
      }
    });

    return [(diabetesCount/this.totalPatient*100).toFixed(2), (dyslipidemiaCount/this.totalPatient*100).toFixed(2), (htaCount/this.totalPatient*100).toFixed(2), (toxicHabitsCount/this.totalPatient*100).toFixed(2)];
  }

  renderChart(series: string[]) {

    const chartOptions = {
      series: series,
      colors: ["#1C64F2", "#16BDCA", "#9061F9", "#FDBA8C"],
      chart: {
        height: 350,
        width: "100%",
        type: "radialBar",
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
      labels: ["Diabetes", "Dyslipidemia", "HTA", "Toxic Habits"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        show:true
      },

    };

    if (document.getElementById("pie-chartMed") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("pie-chartMed"), chartOptions);
      chart.render();
    }
  }
}
