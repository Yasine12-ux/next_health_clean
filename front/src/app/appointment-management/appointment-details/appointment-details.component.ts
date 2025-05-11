import {Component, Input, OnInit} from '@angular/core';
import {AppointmentResponse, AppointmentStatus, AppointmentStatusInFr} from "../models/AppointmentResponse";
import {RdvStateStyle} from "../table/appointments-table/appointments-table.component";
import {Router} from "@angular/router";
import {Drawer, DrawerInterface, type DrawerOptions, initDrawers, type InstanceOptions} from "flowbite";
import {RecordsService} from "../../medical-records/service/records.service";
import {ConsultationResponse} from "../../medical-records/models/ConsultationResponse";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../services/users.service";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import {SideBarService} from "../../pages/components/side-bar/side-bar.service";

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css'
})
export class AppointmentDetailsComponent implements OnInit{
  appointmentResponse: AppointmentResponse | undefined
@Input() drawer : DrawerInterface | null = null

  protected readonly prepareDateTime = prepareDateTime;
  protected readonly RdvStateStyle = RdvStateStyle;
  protected readonly AppointmentStatusInFr = AppointmentStatusInFr;

  constructor(public route: Router,
              private recordsService: RecordsService,
              private toast: ToastrService,
              private tokenStorageService: TokenStorageService,
              ) {

  }


  ngOnInit(): void {


  }
  fiche() {

    if (this.appointmentResponse ) {
      console.log(this.appointmentResponse)
      let name = this.appointmentResponse.patientName.split(" ").join("-")
      console.log("/home/medical-records/fiche-patient/"+this.appointmentResponse.patientId+"/"+name  )
      if (this.tokenStorageService.getUser().permissions.includes("PATIENT_RECORD")) {
        this.drawer?.hide()
        this.route.navigateByUrl("/home/medical-records/fiche-patient/"+this.appointmentResponse.patientId+"/"+name )
      }else
      {   this.drawer?.hide()
        this.route.navigateByUrl("/home/medical-records/dossier/"+this.appointmentResponse.patientId+"/"+name+"/fiche-patient" )


      }
    }
  }
  consultation(){
    if (this.appointmentResponse ) {
      let consultation :ConsultationResponse = {
        idAppointment: this.appointmentResponse.id,
        idPatient: this.appointmentResponse.patientId,
      }
      this.recordsService.getOrCreateByAppointment(this.appointmentResponse.id,this.appointmentResponse.patientId, consultation).subscribe(
        (data) => {
          this.drawer?.hide()
          this.route.navigateByUrl("/home/medical-records/consultation-page/"+this.appointmentResponse?.patientId+"/"+data.id)
        }
        ,
        (error) => {
          if (this.appointmentResponse ) {
            this.drawer?.hide()
            let name = this.appointmentResponse.patientName.split(" ").join("-")
            this.route.navigateByUrl("/home/medical-records/dossier/"+this.appointmentResponse.patientId+"/"+name+"/fiche-patient" )
            this.toast.error("vous devez d'abord créer un fiche patient ")
          }
        }
      )

    }

  }

    protected readonly AppointmentStatus = AppointmentStatus;
}



export const prepareDateTime = (dt: string | undefined)=>{
  return dt? dt.split("T").join(" ").split(".")[0]:""
}


