import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest} from "rxjs";
import {FormControl} from "@angular/forms";
import {initFlowbite} from "flowbite";
import {PlantTableService} from "../../../../Services/tables-services/plant-table.service";
import {PlantResponse} from "../../../../models/PlantResponse";
import {PlantService} from "../../../../Services/plant.service";
import {ToastrService} from "ngx-toastr";
import {EditPlantComponent} from "../../edit-plant/edit-plant.component";
import {AppointmentStatus} from "../../../../../appointment-management/models/AppointmentResponse";
import {StructuresService} from "../../../../structures.service";


interface filterParams{show_archive:boolean,show_enabled:boolean,show_disabled:boolean}
@Component({
  selector: 'structure-plant-table',
  templateUrl: './plant-table.component.html',
  styleUrl: './plant-table.component.css'
})
export class PlantTableComponent implements OnInit,AfterViewInit {
  @ViewChild(EditPlantComponent)editPlantComponent!:EditPlantComponent;

  // @ViewChild(EditUserDetailsComponent) editUserDetailsComponent!: EditUserDetailsComponent;
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "name",
    "manager",
    "productSectionsCount",
    "segmentsCount",
    "linesCount",
    'Action'

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');



  constructor(
    private structureService:StructuresService,
    private plantTableService:PlantTableService,
    private plantService:PlantService,
    private toastrService:ToastrService
  ) { }

  ngAfterViewInit(): void {}

  ngOnInit() {
    initFlowbite()

    this.loadPlants()

    this.plantTableService.getPlantsBS().subscribe({
      next:(data)=>{
        this.dataSize = data.length
      }
    })

    // pagination
    combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
      .subscribe(([allSources, currentPage, pageSize]) => {
        const startingIndex = (currentPage - 1) * pageSize;
        const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
        this.dataOnPage$.next(onPage);
      });

    // Search and sort
    combineLatest(this.plantTableService.getPlantsBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection]) => {

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
        // filteredHeroes=filteredHeroes.filter(user => user.isArchived==false);

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


  changePageSize$(nbPage:number){
    this.pageSize$.next(nbPage)
    this.changeCurrentPage(1)
  }


  ///// Logic
  loadPlants() {
    this.structureService.getAllPlants().subscribe(
      (res: PlantResponse[]) => {
        this.plantTableService.setPlantsBS(res)

      },
      (error:any)=>{

      });
  }


  protected readonly alert = alert;
  // userToModify: UserInfo={};

  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-user-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }

  deletePlant(id:number){
    this.plantService.deletePlant(id).subscribe(
()=>{
    this.toastrService.success("supprimé");
    this.plantTableService.deletePlant(id)
},
  ()=>{
    this.toastrService.error("erreur, impossible de supprimer");

      }
      )
  }




  deleteConfirmationDialogHidden = true;
  appointmentIdToDelete = -1;

  showDeleteConfirmationDialog(appointmentId: number) {
    this.appointmentIdToDelete = appointmentId;


    this.deleteConfirmationDialogHidden = false;
  }
  confirmDelete(isConfirmed: boolean) {
    if (isConfirmed) {

      if (this.appointmentIdToDelete !== -1) {
        this.deletePlant(this.appointmentIdToDelete)

      }
    }
    this.deleteConfirmationDialogHidden = true;
  }

  protected readonly AppointmentStatus = AppointmentStatus;
}
