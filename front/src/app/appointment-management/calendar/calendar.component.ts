import {Component, OnInit} from '@angular/core';
import {AppointmentResponse, AppointmentStatus, AppointmentStatusInFr} from "../models/AppointmentResponse";
import {AppointmentManagementTableService} from "../services/tables/appointment-management-table.service";
import {AppointmentsService} from "../services/appointments.service";
import {Drawer, DrawerInterface, DrawerOptions, initFlowbite, InstanceOptions} from "flowbite";
import {prepareDateTime} from "../appointment-details/appointment-details.component";
import {RdvStateStyle} from "../table/appointments-table/appointments-table.component";
import {Router} from "@angular/router";
import {PlantService} from "../../structures/Services/plant.service";
import {PlantSimpleResponse} from "../../structures/models/PlantSimpleResponse";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit{
  drawer: DrawerInterface|null = null

  appointmentList: AppointmentResponse[]=[]

  constructor(
    private  appointmentManagementTableService:AppointmentManagementTableService,
    private  appointmentsService:AppointmentsService,
    public router:Router,
    private plantService:PlantService


  ) {
  }
  plants:PlantSimpleResponse[]=[]
  selectedCabinet =0

  ngOnInit() {
    initFlowbite()
    if(this.router.url.includes("/rh/appointments/calendar"))
      this.loadPlants()

    this.loadRDVsOnInit();
    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-rdv-details2');

// options with default values
    const options: DrawerOptions = {
      placement: 'left',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
    };
    const instanceOptions: InstanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.drawer = new Drawer($targetEl, options, instanceOptions);

  }
  loadRDVs() {
    this.appointmentManagementTableService.getRdvBS().subscribe(
      data=>{
        this.appointmentList=data.filter(rdv=>rdv.status!=AppointmentStatus.CANCELLED)
      }
    )

  }
  loadRDVsOnInit() {
      const today= this.getTodayDate()
      this.appointmentManagementTableService.setSelectedDate(today)
      this.loadRDVs()
  }

  getTimeFromDate(dateTime:string):string{
    return dateTime.split(RegExp("[T\.]"))[1].substring(0,5)
  }

  getElementPosByStartDateTime(startDateTime:string){
    const time=this.getTimeFromDate(startDateTime)
    const hm = time.split(":").map(Number)
    const pos =  (((hm[0]-7)+hm[1]/60) * 26)+(hm[0]/4)+14
    return pos-pos%1
  }
  calculateRdvTime(startDateTime:string,endDateTime:string):number{
    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();
    const durationInMinutes = (end - start) / (1000 * 60);
    const lenForHtml = durationInMinutes /9*4

    return lenForHtml-(lenForHtml%1);
  }

  getTodayDate(){
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits with leading zero
    const day = today.getDate().toString().padStart(2, '0'); // Ensure 2 digits with leading zero

    return  `${year}-${month}-${day}`;
  }

  loadPlants(){
    this.plantService.getAllPlantsMini().subscribe(
      data=>{
        this.plants =data;
        this.selectedCabinet=data[0].id?data[0].id:1
      }
    )
  }

  protected readonly alert = alert;
  appointmentResponse: AppointmentResponse|undefined;
  protected readonly prepareDateTime = prepareDateTime;
  protected readonly RdvStateStyle = RdvStateStyle;

  filterByCabinet(appointmentList: AppointmentResponse[], selectedCabinet: number) {
    if(this.router.url.includes("/rh/appointments/calendar"))
      return  appointmentList.filter((rdv)=>rdv.appointmentLocationPlantId==selectedCabinet);
    return appointmentList
  }

  protected readonly AppointmentStatus = AppointmentStatus;
  protected readonly AppointmentStatusInFr = AppointmentStatusInFr;
}
