import {Component, OnDestroy, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest} from "rxjs";
import {FormControl} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {UserTableService} from "../../../users/service/user-table.service";
import {ToastrService} from "ngx-toastr";
import {Drawer, DrawerInterface, DrawerOptions, initFlowbite, InstanceOptions} from "flowbite";
import {UserResponse} from "../../../models/user-response";
import {AppointmentsService} from "../../services/appointments.service";
import {AppointmentManagementTableService} from "../../services/tables/appointment-management-table.service";
import {AppointmentResponse, AppointmentStatus, AppointmentStatusInFr} from "../../models/AppointmentResponse";
import {AppointmentDetailsComponent} from "../../appointment-details/appointment-details.component";
import {Router} from "@angular/router";
import {PlantSimpleResponse} from "../../../structures/models/PlantSimpleResponse";
import {PlantService} from "../../../structures/Services/plant.service";
interface filterParams{SCHEDULED:boolean,COMPLETED:boolean,CANCELLED:boolean}

@Component({
  selector: 'app-appointments-table',
  templateUrl: './appointments-table.component.html',
  styleUrl: './appointments-table.component.css'
})
export class AppointmentsTableComponent implements OnDestroy{
  @ViewChild(AppointmentDetailsComponent) appointmentDetailsComponent!:AppointmentDetailsComponent

  tableDataSource$ = new BehaviorSubject<AppointmentResponse[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "patientName",
    "startTime",
    "status",
    'Action'

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');


  filterParamsVar:filterParams={"SCHEDULED":true,"COMPLETED":true,"CANCELLED":true}
  statusFilter$ =new BehaviorSubject<filterParams>(this.filterParamsVar)

  /// delete confirmation dialog
  archiveConfirmationDialogHidden=true
  archiveConfirmationDialogTitle="Archive User"
  archiveConfirmationDialogMessage="Are you sure?"
  archiveConfirmationDialogConfirmBtnText= "Archive"
  userOldArchivedStatus:boolean=false;
  userIdArchive=-1

  selectedCabinet=new BehaviorSubject<number>(0)
  plants:PlantSimpleResponse[]=[]



  drawer: DrawerInterface|null = null


  constructor(
    private appointmentsService:AppointmentsService,
    private appointmentManagementTableService:AppointmentManagementTableService,
    private toastr:ToastrService,
    public router:Router,
    private plantService:PlantService
  ) { }

  ngOnDestroy(): void {
    }

  ngAfterViewInit(): void {
    initFlowbite()

    if(this.router.url.includes("/rh/appointments/list"))
      this.loadPlants()

    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-rdv-details');

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

  cancelConfirmationDialogHidden = true;
  completeConfirmationDialogHidden = true;
  appointmentIdToCancel = -1;
  appointmentIdToComplete = -1;
  appointementStatus:string="";





  //

  ngOnInit() {
    initFlowbite()

    // table base functions
    // data size
    this.appointmentManagementTableService.getRdvBS().subscribe(data => {
      this.tableDataSource$.subscribe(data=>{
        if(this.currentPage$.getValue()>(data.length/this.pageSize$.getValue()))
          this.currentPage$.next(1)
        this.dataSize=data.length

      })
    });

    // pagination
    combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
      .subscribe(([allSources, currentPage, pageSize]) => {
        const startingIndex = (currentPage - 1) * pageSize;
        const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
        this.dataOnPage$.next(onPage);
      });



    // Search and sort
    combineLatest(this.appointmentManagementTableService.getRdvBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$,this.statusFilter$,this.selectedCabinet)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection,filters,cabinet]) => {

        changedHeroData = changedHeroData.filter(rdv=>
          (filters.COMPLETED && rdv.status==AppointmentStatus.COMPLETED) || (filters.SCHEDULED && rdv.status==AppointmentStatus.SCHEDULED)  || (filters.CANCELLED && rdv.status==AppointmentStatus.CANCELLED))

        const heroesArray = Object.values(changedHeroData);
        let filteredHeroes: any[];
        if (!searchTerm) {
          filteredHeroes = heroesArray;
        } else {
          const filteredResults = heroesArray.filter(hero => {
            return Object.values(hero)
              .reduce((prev, curr) => {
                return prev || curr?.toString().toLowerCase().includes(searchTerm.toLowerCase());
              }, false);
          });
          filteredHeroes = filteredResults;
        }

        if(cabinet!=0)
          filteredHeroes=filteredHeroes.filter(rdv => rdv.appointmentLocationPlantId==cabinet);

        const sortedHeroes = filteredHeroes.sort((a, b) => {
          if(a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          if(a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          return 0;
        });

        this.tableDataSource$.next(sortedHeroes);
      });

    this.searchFormControl.setValue('');
  }
  changeCurrentPage(page: number) {
    this.currentPage$.next(page)
  }

  adjustSort(key: string) {
    if (this.sortKey$.value === key) {
      if (this.sortDirection$.value === 'asc') {
        this.sortDirection$.next('desc');
      } else {
        this.sortDirection$.next('asc');
      }
      return;
    }

    this.sortKey$.next(key);
    this.sortDirection$.next('asc');
  }

  changeStatusFilter(){

    this.statusFilter$.next(this.filterParamsVar)
  }

  changePageSize$(nbPage:number){
    this.pageSize$.next(nbPage)
    this.changeCurrentPage(1)
  }

  loadPlants(){
    this.plantService.getAllPlantsMini().subscribe(
      data=>{
        this.plants =data;
      }
    )
  }

  showCancelConfirmationDialog(appointmentId: number,appointmentStatus:string) {
    this.appointmentIdToCancel = appointmentId;
    this.appointementStatus=appointmentStatus
    this.cancelConfirmationDialogHidden = false;
  }

  showCompleteConfirmationDialog(appointmentId: number,appointmentStatus:string) {
    this.appointmentIdToComplete = appointmentId;
    this.appointementStatus=appointmentStatus
    this.completeConfirmationDialogHidden = false;
  }
  confirmComplete(isConfirmed: boolean) {
    if (isConfirmed) {
      if (this.appointmentIdToComplete !== -1) {
       this.changeStatusAppointment(this.appointmentIdToComplete,AppointmentStatus.COMPLETED)

      }
    }
    this.completeConfirmationDialogHidden = true;
  }

  confirmCancel(isConfirmed: boolean) {
    if (isConfirmed) {

      if (this.appointmentIdToCancel !== -1) {
        this.changeStatusAppointment(this.appointmentIdToCancel,AppointmentStatus.CANCELLED)
      }
    }
    this.cancelConfirmationDialogHidden = true;
  }







  changeStatusAppointment(id:number, appointmentStatus:string){


    this.appointmentsService.changeAppointmentStatus(id,appointmentStatus).subscribe(
      (res:AppointmentResponse)=>{
        this.appointmentManagementTableService.updateAppointment(res)
        if (appointmentStatus==AppointmentStatus.COMPLETED)
          this.toastr.success("rendez-vous est completé ")
        else
        this.toastr.success("rendez-vous est annuler ")

      }
    )
    this.completeConfirmationDialogHidden = true;
    this.cancelConfirmationDialogHidden = true;
  }

  protected readonly alert = alert;

  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-user-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }

  protected readonly AppointmentStatus = AppointmentStatus;
  protected readonly RdvStateStyle = RdvStateStyle;

  setCabinet(value:any) {
    this.selectedCabinet.next(value.target.value)
  }

  protected readonly AppointmentStatusInFr = AppointmentStatusInFr;
}
export const RdvStateStyle:{[key: string]: string}={
  "COMPLETED":"bg-green-100 text-green-800 text-xs font-medium  px-2.5 py-0.5 rounded border border-green-400",
  "SCHEDULED":"bg-yellow-100 text-yellow-800 text-xs font-medium  px-2.5 py-0.5 rounded border border-yellow-400",
  "CANCELLED":"bg-red-100 text-red-800 text-xs font-medium  px-2.5 py-0.5 rounded border border-red-400",

}
