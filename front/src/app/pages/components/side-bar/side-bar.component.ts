import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {UsersService} from "../../../services/users.service";
import {SideBarService} from "./side-bar.service";


export const  permissionPages:{[key: string]: string} ={
  USER_MANAGEMENT:"home/users",
  ROLE_MANAGEMENT:"home/roles",
  STRUCTURE_MANAGEMENT:"home/structures",


  RH_APPOINTMENT:"home/rh/rh/appointments/list",


  NURSE_APPOINTMENT:"home/inf/inf/appointments/list",
  NURSE_DASHBOARD:"home/inf/inf/dashboard",
  BLOCK_OUT_APPOINTMENT:"home/inf/inf/blockout",


  LINE_MANAGER_DASHBOARD:"home/ml/manager-line/dashboard",
  LINE_MANAGER_APPOINTMENT:"home/ml/manager-line/appointments/list",


  SEGMENT_MANAGER_DASHBOARD:"home/ms/manager-segment/dashboard",
  SEGMENT_MANAGER_APPOINTMENT:"home/ms/manager-segment/appointments/list",


  PLANT_MANAGER_DASHBOARD:"home/plantManager/plantManager/dashboard",

  PS_MANAGER_DASHBOARD:"home/psManager/psManager/dashboard",

  PATIENT_RECORD:"home/medical-records/patients",
  DOCTOR_APPOINTMENT:"home/doctor/doctor/appointments/list",
  DOSSIER_MEDICAL:"home/medical-records/dossier",
  RH_DASHBOARD:"home/rh/rh/dashboard",
  DOCTOR_DASHBOARD:"home/doctor/doctor/dashboard",
}
export const  permissionPagesTitles:{[key: string]: string} ={
  USER_MANAGEMENT:"Utilisateurs",
  ROLE_MANAGEMENT:"Rôles",
  STRUCTURE_MANAGEMENT:"Structures",

  RH_APPOINTMENT:"RH Liste RDV",


  BLOCK_OUT_APPOINTMENT:"Verrouillage de disponibilité",
  NURSE_DASHBOARD:"Tableau de bord infirmière",
  NURSE_APPOINTMENT:"Infermiere RDV",

  LINE_MANAGER_DASHBOARD:"Tableau de bord contremaître",
  LINE_MANAGER_APPOINTMENT:"Contremaître RDV",


  SEGMENT_MANAGER_DASHBOARD:"Tableau de bord Segment",
  SEGMENT_MANAGER_APPOINTMENT:"Chef Segments RDV",

  PLANT_MANAGER_DASHBOARD:"Tableau de bord Plant",

  PS_MANAGER_DASHBOARD:"Tableau de bord PS",

  PATIENT_RECORD:"Patients",
  DOCTOR_APPOINTMENT:"Doctor RDV",
  DOSSIER_MEDICAL:"Dossier medical",
  RH_DASHBOARD:"Tableau de bord RH",
  DOCTOR_DASHBOARD:"Tableau de bord Doctor",
}
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit{
  permissions:string[]=[]
  user:any=[];
  constructor(
    private routing:Router,
    private tokenStorageService:TokenStorageService,
    private Userservice:UsersService,
    private sideBarService:SideBarService,
  ) {
    sideBarService.setState(true)
  }
  icons:{[key: string]: string} ={
    USER_MANAGEMENT:"/assets/icons/permissions/users.svg",
    ROLE_MANAGEMENT:"/assets/icons/permissions/roles.svg",
    STRUCTURE_MANAGEMENT:"/assets/icons/permissions/structure.svg",
    RH_APPOINTMENT:"/assets/icons/permissions/calendar.svg",
    NURSE_APPOINTMENT:"/assets/icons/permissions/calendar.svg",
    LINE_MANAGER_APPOINTMENT:"/assets/icons/permissions/calendar.svg",
    SEGMENT_MANAGER_APPOINTMENT:"/assets/icons/permissions/calendar.svg",
    BLOCK_OUT_APPOINTMENT:"/assets/icons/permissions/calendar-block-out.svg",
    NURSE_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",
    LINE_MANAGER_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",
    SEGMENT_MANAGER_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",
    PLANT_MANAGER_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",
    PS_MANAGER_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",
    PATIENT_RECORD:"/assets/icons/permissions/patientList.svg",
    DOCTOR_APPOINTMENT:"/assets/icons/permissions/calendar.svg",

    DOSSIER_MEDICAL:"/assets/icons/permissions/file-medical-fill.svg",
    RH_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",
    DOCTOR_DASHBOARD:"/assets/icons/permissions/dashboard-fill.svg",

    logout:"/assets/icons/logout.svg",
  }

  hello: any;
  @Input({transform: numberAttribute})  maximized:number=1;

  widthChangeClickHandler(){
    this.maximized=(this.maximized+1)%2;
    this.notifyOtherStateChanged()
  }

  notifyOtherStateChanged(){
    setTimeout(()=>{
        this.sideBarService.setState(Boolean(this.maximized))},
      0)
  }

  ngOnInit(): void {
    initFlowbite();
    // Retrieve and sort user permissions
    const userPermissions = (this.tokenStorageService.getUser()?.permissions || []);
    this.permissions = userPermissions.filter((permission:any) => permissionPagesTitles.hasOwnProperty(permission)).sort();
    const dashboardIndex = this.permissions.findIndex((permission:any) => {
      const title = permissionPagesTitles[permission];
      return title && title.includes("Tableau de bord");
    });

    if (dashboardIndex !== -1) {
      // Remove the permission from its current position
      const [dashboardPermission] = this.permissions.splice(dashboardIndex, 1);
      // Add it to the beginning of the array
      this.permissions.unshift(dashboardPermission);
    }
    // Filter permissions that have corresponding pages

    this.notifyOtherStateChanged();
  }


  logout(){
    this.tokenStorageService.signOut()
  }

  protected readonly permissionPages = permissionPages;

  protected readonly permissionPagesTitles = permissionPagesTitles;

  redirectToFirstPermission()
  {
    const userPermissions = (this.tokenStorageService.getUser()?.permissions || []);

    this.routing.navigateByUrl(permissionPages[userPermissions[0]])
  }
}
