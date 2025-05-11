import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Drawer, type DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {SelectionType} from "../../components/structures-list-selector/structures-list-selector.component";
import {SegmentSimpleResponse} from "../../structures/models/SegmentSimpleResponse";
import {LineResponse} from "../../structures/models/LineResponse";
import {UserResponse} from "../../models/user-response";
import {UsersService} from "../../services/users.service";
import {LineService} from "../../structures/Services/line.service";
import {StructureMiniResponse} from "../../structures/models/StructureMiniResponse";
import {UserStructureResponse} from "../../structures/models/UserStructureResponse";
import {AppointmentsService} from "../services/appointments.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {ToastrService} from "ngx-toastr";
import {AppointmentRequest} from "../models/AppointmentRequest";
import {ALL_RDV, AppointmentManagementTableService} from "../services/tables/appointment-management-table.service";
import {PlantService} from "../../structures/Services/plant.service";
import {PlantSimpleResponse} from "../../structures/models/PlantSimpleResponse";
import {ProductSectionService} from "../../structures/Services/product-section.service";
import {SegmentService} from "../../structures/Services/segment.service";
import {ProductSectionSimpleResponse} from "../../structures/models/ProductSectionSimpleResponse";
import {ProductSectionResponse} from "../../structures/models/ProductSectionResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css'
})
export class CreateAppointmentComponent implements OnInit{
  drawer: DrawerInterface|null = null
  @Input()displayingDate:string=""
  @ViewChild('dateInput') dateInput!: ElementRef;


  dateStylesDict:{[key:string]: any}={
    "normal":"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
    "valid":"bg-green-50 border border-green-500 text-green-900 placeholder-green-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5",
    "invalid":"bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500  focus:border-red-500 block w-full p-2.5",
    "full":"bg-purple-50 border border-purple-500 text-purple-900 placeholder-purple-700 text-sm rounded-lg focus:ring-purple-500  focus:border-purple-500 block w-full p-2.5"
  }
  dateStyleClass:string= "normal";
  patientStyleClass:string="normal"
  errorPatientOldRdvDate=""

  ngOnInit() {
    initFlowbite()
    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-appointment');

// options with default values
    const options: DrawerOptions = {
      placement: 'left',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
      onHide: () => {
      },
      onShow: () => {
        this.loadPlants()

        if(this.router.url.includes('/inf/')) {
          this.loadPS();
          this.appointmentsService.getNursePlant().subscribe(
            data=>{
              this.form.appointmentLocationPlantId=data.id
            }
          )
        }
        else this.loadSegments()
      },
      onToggle: () => {
      },
    };
    const instanceOptions: InstanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.drawer = new Drawer($targetEl, options, instanceOptions);


  }

  constructor(
    private usersService:UsersService,
    private lineService:LineService,
    private productSectionService:ProductSectionService,
    private plantService:PlantService,
    private appointmentsService:AppointmentsService,
    private segmentService:SegmentService,
    private toastrService:ToastrService,
    private  appointmentManagementTableService:AppointmentManagementTableService,
    public router:Router,
  ) {
  }


  form:AppointmentRequest={}


  selectedPsId: number=0;
  Pss: ProductSectionResponse[]=[]

  selectedSegmentId: number=0;
  segments: StructureMiniResponse[]=[]

  selectedLineId: number=0;
  lines: StructureMiniResponse[]=[]

  workers: UserStructureResponse[]=[]


  selectedDate:Date=new Date(Date.now())
  timesDispo:string[]=[]

  selectedTime:string=""

  plants:PlantSimpleResponse[]=[]



  loadSegments(){
    this.usersService.getSegmentsByRh().subscribe(
      (data)=>{
        this.segments=data;

      }
    )
  }

  loadPlants(){
    this.plantService.getAllPlantsMini().subscribe(
      data=>{
        this.plants =data;
      }
    )
  }

  loadLines(value:any){
    this.lines=[]
    this.selectedLineId=0
    this.selectedSegmentId=value.target.value
    if(this.selectedSegmentId==0) return
    this.lineService.getMiniLinesBySegmentId(this.selectedSegmentId).subscribe(
      (data)=>{
        this.lines=data
      }
    )
  }

  loadWorkers(value:any){
    this.workers=[]
    this.selectedLineId=value.target.value
    if(this.selectedLineId==0) return
    this.lineService.getLineWorkers(this.selectedLineId).subscribe(
      (data)=>{
        this.workers = data
      }
    )

  }

  protected readonly alert = alert;

  showDateDispo(value: any) {
    this.selectedDate = value.target.value
    if(Date.now()> new Date(this.selectedDate).getTime()) {
      this.timesDispo=[]
      this.dateStyleClass="invalid"
      return
    }
    this.dateStyleClass="valid"
    this.appointmentsService.getAvailableDates(this.selectedDate.toString(),this.form.appointmentLocationPlantId||0).subscribe(
      (data)=> {
        this.timesDispo = data
        if(data.length==0){
          this.dateStyleClass="full"
        }else{
          this.selectedTime=data[0]
        }
      })
  }
  saveAppointment(){
    if(!this.form.patientId || !this.selectedDate ||!this.selectedTime ){
      this.toastrService.error("veuillez remplir les champs obligatoires.")
    }
    this.form.startTime=this.selectedDate+"T"+this.selectedTime
    this.appointmentsService.createAppointment(this.form).subscribe(
      (data)=>{

        if(this.appointmentManagementTableService.getSelectedDate().getValue()==ALL_RDV ||  data.startTime.split("T")[0]==this.displayingDate)
          this.appointmentManagementTableService.addAppointment(data)

        this.form={}

        this.selectedPsId=0

        this.selectedSegmentId=0;
        this.segments=[]

        this.selectedLineId=0;
        this.lines=[]

        this.workers=[]
        this.timesDispo=[]

        this.dateInput.nativeElement.value=''

        this.patientStyleClass="normal"
        this.dateStyleClass= "normal";

        this.drawer?.hide()
        this.toastrService.success("Rendez-vous ajouté avec succès.")
      },
      error => {
        // console.log(error)


        // console.log(error.error)
          // this.errorPatientOldRdvDate=error.error.split(" ")[6].split('startTime":"')[1].slice(0,10)
        this.patientStyleClass= "invalid";
          console.log(this.errorPatientOldRdvDate)
      },
    )
  }

  loadPS() {
    this.productSectionService.getMiniProductSectionsByNurse().subscribe(
      data=>{
        this.Pss=data
      }
    )
  }
  loadSegmentsWithPS(value:any) {
    this.selectedPsId=value.target.value
      this.segmentService.getMiniSegmentsByProductSectionId(this.selectedPsId).subscribe(
        data=>{
          this.segments=data
          this.selectedSegmentId=0
        }
      )
  }

}
