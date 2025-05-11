import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FichePatientService } from "../../../../medical-records/service/fiche-patient.service";
import { FichePatientResponse } from "../../../../medical-records/models/FichePatientResponse";

@Component({
  selector: 'app-femme-pie-chart',
  templateUrl: './pie-chart-femme.component.html',
  // styleUrls: ['./pie-chart-femme.component.css']
})
export class PieChartFemmeComponent implements OnInit {
  totalPatient:number=0
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
    let pregnanciesCount = 0;
    let livingChildrenCount = 0;
    let contraceptionUseCount = 0;
    let femalePatientCount = 0;
this.totalPatient=data.length
    data.forEach(patient => {
      if (patient.sexe === 'Femme') {
        femalePatientCount++;
        if (patient.diabete) diabetesCount++;
        if (patient.dyslipidemie) dyslipidemiaCount++;
        if (patient.HTA) htaCount++;
        if (patient.tabacStatus !== 'NON_FUMEUR' || (patient.alcoolSemaine && patient.alcoolSemaine > 0) || patient.drogue) toxicHabitsCount++;
        pregnanciesCount += patient.nbGrossesse || 0;
        livingChildrenCount += patient.nbEnfantsVivants || 0;
        if (patient.contraceptionUtilisee) contraceptionUseCount++;
      }
    });

    const averagePregnancies = femalePatientCount > 0 ? pregnanciesCount / femalePatientCount : 0;
    const averageLivingChildren = femalePatientCount > 0 ? livingChildrenCount / femalePatientCount : 0;
    const averageContraceptionUse = femalePatientCount > 0 ? contraceptionUseCount / femalePatientCount : 0;



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
        radialBar: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -25
          }
        },
      },
      labels: ["Diabète", "Dyslipidémie", "HTA", "Habitudes Toxiques"],
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
      yaxis: {
        show:true
        ,
        labels: {
          formatter: function (value: any) {

            return value;
          }
        },
      },
      xaxis: {
        show:true
        ,
        labels: {
          formatter: function (value: any) {

            return value;
          }
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
      },
    };

    if (document.getElementById("pie-chartFemme") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("pie-chartFemme"), chartOptions);
      chart.render();
    }
  }
}
