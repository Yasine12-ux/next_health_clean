import {Component, OnInit} from '@angular/core';
import ApexCharts from 'apexcharts';
import {initFlowbite} from "flowbite";
import {DashbordService} from "../services/dashboard.service";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {Router} from "@angular/router";
import {AppointmentsService} from "../../services/appointments.service";

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
   scheduledAppointments: any;
   cancelledAppointments: any;
    appoitmentData: any;
  constructor(private dashboardService: DashbordService, private tokenService: TokenStorageService,
              protected router: Router, private appointementService:AppointmentsService
              ) { }

  totalAppoitement: any;
  totalPatient: any;
  totalDoctor: any;
  totalRDVPlanifie: any;
  totalRDVRealise: any;
  totalRDVAnnule: any;
  totalDoctors: any;
  pTest = false;
  totalAppointmentsChange: string | undefined ;
  totalPatientsChange: string | undefined;
  monday: any;
  thursday: any;
  wednesday: any;
  tuesday: any;
  friday: any;
  saturday: any;
  totalRDVPlanifiePerc: any;
  totalRDVRealisePerc: any;
  totalRDVAnnulePerc: any;
ManagerData: any;

  ngOnInit(): void {
    initFlowbite();
    this.getAllPatientBylineManager();
  }

LastWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
  const lastMonday = new Date();
  lastMonday.setDate(diffToMonday - 7);
  const lastSunday = new Date();
  lastSunday.setDate(diffToMonday - 1); // adjust to get last Saturday

  return { start: lastMonday, end: lastSunday };
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




  getAppointmentsForThisWeek(data: any) {
    const thisWeek = this.getThisWeek();

    const thisWeekData = data.filter((item: any) => {
      const appointmentDate = new Date(item.startTime);
      return appointmentDate >= thisWeek.start && appointmentDate <= thisWeek.end;
    });

    this.scheduledAppointments = thisWeekData.filter((item: any) => item.status === 'SCHEDULED').slice(0, 5);
    this.cancelledAppointments = thisWeekData.filter((item: any) => item.status === 'CANCELLED').slice(0, 5);
    this.appoitmentData = this.scheduledAppointments.concat(this.cancelledAppointments);
    const { scheduledAppointments, cancelledAppointments } = this;
    return { scheduledAppointments, cancelledAppointments };
  }


getPercentageChange(data: any) {
  const lastWeek = this.LastWeek();
  const thisWeek = this.getThisWeek();
  const lastWeekData = data.filter((item: any) => {
    const appointmentDate = new Date(item.startTime);
    return appointmentDate >= lastWeek.start && appointmentDate <= lastWeek.end;
  });
  const thisWeekData = data.filter((item: any) => {
    const appointmentDate = new Date(item.startTime);
    return appointmentDate >= thisWeek.start && appointmentDate <= thisWeek.end;
  });

  const lastWeekAppointments = lastWeekData.length;
  const thisWeekAppointments = thisWeekData.length;
  if (lastWeekAppointments === 0) {
    this.totalAppointmentsChange = '0%';
  }
  else
  this.totalAppointmentsChange = (((thisWeekAppointments - lastWeekAppointments) / lastWeekAppointments) * 100).toFixed(2) + "%";
  return this.totalAppointmentsChange;
}
  getPercentagePatientChange(data: any) {
  const lastWeek = this.LastWeek();
  const thisWeek = this.getThisWeek();
  const lastWeekData = data.filter((item: any) => {
    const appointmentDate = new Date(item.startTime);
    return appointmentDate >= lastWeek.start && appointmentDate <= lastWeek.end;
  });
  const thisWeekData = data.filter((item: any) => {
    const appointmentDate = new Date(item.startTime);
    return appointmentDate >= thisWeek.start && appointmentDate <= thisWeek.end;
  });

  const lastWeekPatientIds = lastWeekData.map((item: any) => item.patientId);
  const thisWeekPatientIds = thisWeekData.map((item: any) => item.patientId);

  const lastWeekUniquePatients = lastWeekPatientIds.filter((id: any, index: any) => lastWeekPatientIds.indexOf(id) === index).length;
  const thisWeekUniquePatients = thisWeekPatientIds.filter((id: any, index: any) => thisWeekPatientIds.indexOf(id) === index).length;

  if (lastWeekUniquePatients === 0) {
    this.totalPatientsChange = "0%";
  }
  else
    this.totalPatientsChange = (((thisWeekUniquePatients - lastWeekUniquePatients) / lastWeekUniquePatients) * 100).toFixed(2) + "%";
  return this.totalPatientsChange;
}
  getAllPatientBylineManager() {
    let userPermissions = this.tokenService.getUser().permissions;
    if (userPermissions.includes('PS_MANAGER_DASHBOARD') || userPermissions.includes('PLANT_MANAGER_DASHBOARD')|| userPermissions.includes('SEGMENT_MANAGER_DASHBOARD')|| userPermissions.includes('DOCTOR_DASHBOARD')){
      this.pTest = true;
    }

    const thisweek = this.getThisWeek();
    const lastweek = this.LastWeek();
    // if (userPermissions.includes('Line_Manager_DASHBOARD')){
    if(this.router.url.includes("/manager-line/dashboard")){
    this.dashboardService.getAllPatientBylineManager().subscribe(
      (data: any) => {
        this.getPercentagePatientChange(data);
        this.getPercentageChange(data);
        const thisWeekData = data.filter((item: any) => {
          const appointmentDate = new Date(item.startTime);
          return appointmentDate >= thisweek.start && appointmentDate <= thisweek.end;
        });

        const lastWeekData = data.filter((item: any) => {
          const appointmentDate = new Date(item.startTime);
          return appointmentDate >= lastweek.start && appointmentDate <= lastweek.end;
        });

        const ids = thisWeekData.map((item: any) => item.patientId); // get all ids
        const uniqueIds = ids.filter((id: any, index: any) => ids.indexOf(id) === index);
        this.totalPatient = uniqueIds.length; // count unique ids
        this.totalAppoitement = thisWeekData.length;
        this.totalRDVPlanifie = thisWeekData.filter((item: any) => item.status === 'SCHEDULED').length;
        this.totalRDVAnnule = thisWeekData.filter((item: any) => item.status === 'CANCELLED').length;
        this.totalRDVRealise = thisWeekData.filter((item: any) => item.status === 'COMPLETED').length;

        this.totalRDVPlanifiePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVPlanifie / this.totalAppoitement * 100).toFixed(2));
        this.totalRDVAnnulePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVAnnule / this.totalAppoitement * 100).toFixed(2));
        this.totalRDVRealisePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVRealise / this.totalAppoitement * 100).toFixed(2));
        this.getAppointmentsForThisWeek(data);
        this.updateChartOptions();
        let dayData = this.groupByStartTime(lastWeekData);
        this.updateChartMap(dayData);
      },
      (error: any) => {
        console.log(error);
      }
    );}

    // if (userPermissions.includes('RDV_SEGMENT_MANAGER')){
    else if(this.router.url.includes("/manager-segment/dashboard")){

      this.dashboardService.getAllPatientBySegmentManager().subscribe(
        (data: any) => {
          this.getPercentagePatientChange(data);
          this.getPercentageChange(data);
          const thisWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= thisweek.start && appointmentDate <= thisweek.end;
          });

          const lastWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= lastweek.start && appointmentDate <= lastweek.end;
          });

          const ids = thisWeekData.map((item: any) => item.patientId); // get all ids
          const uniqueIds = ids.filter((id: any, index: any) => ids.indexOf(id) === index);
          this.totalPatient = uniqueIds.length; // count unique ids
          this.totalAppoitement = thisWeekData.length;
          this.totalRDVPlanifie = thisWeekData.filter((item: any) => item.status === 'SCHEDULED').length;
          this.totalRDVAnnule = thisWeekData.filter((item: any) => item.status === 'CANCELLED').length;
          this.totalRDVRealise = thisWeekData.filter((item: any) => item.status === 'COMPLETED').length;

          this.totalRDVPlanifiePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVPlanifie / this.totalAppoitement * 100).toFixed(2));
          this.totalRDVAnnulePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVAnnule / this.totalAppoitement * 100).toFixed(2));
          this.totalRDVRealisePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVRealise / this.totalAppoitement * 100).toFixed(2));
          this.getAppointmentsForThisWeek(data);
          this.updateChartOptions();
          let dayData = this.groupByStartTime(lastWeekData);
          this.updateChartMap(dayData);
        },
        (error: any) => {
          console.log(error);
        }
      );}

    // if (userPermissions.includes('ps')){
    else if(this.router.url.includes("/psManager/dashboard")){

      this.dashboardService.getAllPatientByPsManager().subscribe(
        (data: any) => {
          this.ManagerData = data;
          this.getPercentagePatientChange(data);
          this.getPercentageChange(data);
          const thisWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= thisweek.start && appointmentDate <= thisweek.end;
          });

          const lastWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= lastweek.start && appointmentDate <= lastweek.end;
          });

          const ids = thisWeekData.map((item: any) => item.patientId); // get all ids
          const uniqueIds = ids.filter((id: any, index: any) => ids.indexOf(id) === index);
          this.totalPatient = uniqueIds.length; // count unique ids
          this.totalAppoitement = thisWeekData.length;
          this.totalRDVPlanifie = thisWeekData.filter((item: any) => item.status === 'SCHEDULED').length;
          this.totalRDVAnnule = thisWeekData.filter((item: any) => item.status === 'CANCELLED').length;
          this.totalRDVRealise = thisWeekData.filter((item: any) => item.status === 'COMPLETED').length;

          this.totalRDVPlanifiePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVPlanifie / this.totalAppoitement * 100).toFixed(2));
          this.totalRDVAnnulePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVAnnule / this.totalAppoitement * 100).toFixed(2));
          this.totalRDVRealisePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVRealise / this.totalAppoitement * 100).toFixed(2));
          this.getAppointmentsForThisWeek(data);
          this.updateChartOptions();
          let dayData = this.groupByStartTime(lastWeekData);
          this.updateChartMap(dayData);
        },
        (error: any) => {
          console.log(error);
        }
      );}

    // if (userPermissions.includes('DASHBOARD_manager')){
    else if(this.router.url.includes("/plantManager/dashboard")){
      this.dashboardService.getAllPatientByplantManager().subscribe(
        (data: any) => {
          this.ManagerData = data;
          this.getPercentagePatientChange(data);
          this.getPercentageChange(data);
          const thisWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= thisweek.start && appointmentDate <= thisweek.end;
          });


          const lastWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= lastweek.start && appointmentDate <= lastweek.end;
          });

          const ids = thisWeekData.map((item: any) => item.patientId); // get all ids
          const uniqueIds = ids.filter((id: any, index: any) => ids.indexOf(id) === index);
          this.totalPatient = uniqueIds.length; // count unique ids
          this.totalAppoitement = thisWeekData.length;
          this.totalRDVPlanifie = thisWeekData.filter((item: any) => item.status === 'SCHEDULED').length;
          this.totalRDVAnnule = thisWeekData.filter((item: any) => item.status === 'CANCELLED').length;
          this.totalRDVRealise = thisWeekData.filter((item: any) => item.status === 'COMPLETED').length;

          this.totalRDVPlanifiePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVPlanifie / this.totalAppoitement * 100).toFixed(2));
this.totalRDVAnnulePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVAnnule / this.totalAppoitement * 100).toFixed(2));
this.totalRDVRealisePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVRealise / this.totalAppoitement * 100).toFixed(2));
          this.getAppointmentsForThisWeek(data);
          this.updateChartOptions();
          let dayData = this.groupByStartTime(lastWeekData);
          this.updateChartMap(dayData);
        },
        (error: any) => {
          console.log(error);
        }
      );}
    else if(this.router.url.includes("/doctor/dashboard")){
      this.appointementService.findAllAppointmentsDoctor("1700-01-01","2500-01-01").subscribe(
        (data: any) => {
          console.log(data)
          this.ManagerData = data;
          this.getPercentagePatientChange(data);
          this.getPercentageChange(data);
          const thisWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= thisweek.start && appointmentDate <= thisweek.end;
          });


          const lastWeekData = data.filter((item: any) => {
            const appointmentDate = new Date(item.startTime);
            return appointmentDate >= lastweek.start && appointmentDate <= lastweek.end;
          });

          const ids = thisWeekData.map((item: any) => item.patientId); // get all ids
          const uniqueIds = ids.filter((id: any, index: any) => ids.indexOf(id) === index);
          this.totalPatient = uniqueIds.length; // count unique ids
          this.totalAppoitement = thisWeekData.length;
          this.totalRDVPlanifie = thisWeekData.filter((item: any) => item.status === 'SCHEDULED').length;
          this.totalRDVAnnule = thisWeekData.filter((item: any) => item.status === 'CANCELLED').length;
          this.totalRDVRealise = thisWeekData.filter((item: any) => item.status === 'COMPLETED').length;

          this.totalRDVPlanifiePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVPlanifie / this.totalAppoitement * 100).toFixed(2));
          this.totalRDVAnnulePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVAnnule / this.totalAppoitement * 100).toFixed(2));
          this.totalRDVRealisePerc = this.totalAppoitement == 0 ? 0 : parseFloat((this.totalRDVRealise / this.totalAppoitement * 100).toFixed(2));
          this.getAppointmentsForThisWeek(data);
          this.updateChartOptions();
          let dayData = this.groupByStartTime(lastWeekData);
          this.updateChartMap(dayData);

        },
        (error: any) => {
          console.log(error);
        }
      );}
  }

  groupByStartTime(data: any) {
    const dayMap: { [key: number]: keyof typeof groupedData } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };

    const groupedData: { [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: number } = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };

    data.forEach((item: any) => {
      const appointmentDate = new Date(item.startTime);
      if (!isNaN(appointmentDate.getTime())) { // Check if the date is valid
        const day = appointmentDate.getDay();
        const dayName = dayMap[day];
        if (dayName in groupedData) { // Ensure the dayName is a valid key in groupedData
          groupedData[dayName]++;
        } else {
          console.error(`Invalid day name: ${dayName}`);
        }
      } else {
        console.error(`Invalid date: ${item.startTime}`);
      }
    });

    return Object.keys(groupedData).map(key => ({ name: key as keyof typeof groupedData, value: groupedData[key as keyof typeof groupedData] }));
  }

  updateChartOptions() {
    const getChartOptions = () => {
      return {
        series: [this.totalRDVRealisePerc,  this.totalRDVPlanifiePerc,this.totalRDVAnnulePerc],
        colors: ["#BBF7D0", "#FED7AA", "#FECACA"],
        chart: {
          height: "200px",
          width: "100%",
          type: "pie",
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          pie: {
            track: {
              background: '#E5E7EB',
            },
            dataLabels: {
              show: false,
            },
            hollow: {
              margin: 0,
              size: "32%",
            }
          },
        },
        grid: {
          show: false,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: -23,
            bottom: -20,
          },
        },
        labels: ["Compléter", "Planifier", "Annuler"],
        legend: {
          show: true,
          position: "bottom",
          fontFamily: "Inter, sans-serif",
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
        },
        yaxis: {
          show: false,
          labels: {
            formatter: function (value: any) {
              return value + '%';
            }
          }
        }
      };
    }

    if (document.getElementById("radial-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.querySelector("#radial-chart"), getChartOptions());
      chart.render();
    }
  }
    paddingInterval()
    {
      if (this.pTest)
        return 20
      else
        return 2
    }
  updateChartMap(dayData: any) {
const categories = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const options = {
      chart: {
        height: "90%",
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
          left: 20,
          right: 20,
          top: 0
        },
      },
      series: [
        {
          name: "Rendez-vous",
          data: dayData.map((item: any) => item.value),
          color: "lightgreen",
        },
      ],
      xaxis: {
        categories: categories,
        labels: {
          show: false,
        },
        axisBorder: {
          show: true,
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
      const chart = new ApexCharts(document.getElementById("area-chart"), options);
      chart.render();
    }
  }

  statusTranslate(status: string) {
    switch (status) {
      case 'SCHEDULED':
        return 'Planifié';
      case 'COMPLETED':
        return 'Complété';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  }

  userManage()
  {
    if (this.router.url.includes("/manager-line/dashboard"))
    {
      return true
    }
    else if (this.router.url.includes("/manager-segment/dashboard"))
    {
      return true
    }
    else if (this.router.url.includes("/plantManager/dashboard"))
    {
      return false
    }
    else if (this.router.url.includes("/psManager/dashboard"))
    {
      return false
    }
    else if (this.router.url.includes("/doctor/dashboard"))
    {
      return false
    }
    else
      return false
  }
}
