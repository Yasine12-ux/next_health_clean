import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, switchMap, take, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {initFlowbite} from "flowbite";
import {SegmentTableService} from "../../../Services/tables-services/segment-table.service";
import {SegmentResponse} from "../../../models/SegmentResponse";
import {ToastrService} from "ngx-toastr";
import {SegmentService} from "../../../Services/segment.service";
import {EditSegmentComponent} from "../edit-segment/edit-segment.component";
import {StructuresService} from "../../../structures.service";


interface filterParams{show_archive:boolean,show_enabled:boolean,show_disabled:boolean}
@Component({
  selector: 'structure-segment-table',
  templateUrl: './segment-table.component.html',
  styleUrl: './segment-table.component.css'
})
export class SegmentTableComponent implements OnInit,AfterViewInit {
  @ViewChild(EditSegmentComponent) editSegmentComponent!: EditSegmentComponent;
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "segmentName",
    "productSection",
    "lineCount",
    "manager",
    // "doctor",
    "rh",
    'Action'

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');



  plantsNames:string[]=[]
  plantSearchSelected:BehaviorSubject<string>=new BehaviorSubject<string>("")

  productSectionNames:string[]=[]
  productSectionSearchSelected:BehaviorSubject<string>=new BehaviorSubject<string>("")


  constructor(
    private structureService:StructuresService,
    private segmentTableService:SegmentTableService,
    private segmentService:SegmentService,
    private toastrService:ToastrService

  ) { }

  ngAfterViewInit(): void {}

  ngOnInit() {
    initFlowbite()

    this.loadSegments()

    this.segmentTableService.getPlantsNames().subscribe({
      next:(data)=>{
        this.plantsNames = data
      }
    })

    this.segmentTableService.getSegmentsBS().subscribe({
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
    combineLatest(this.segmentTableService.getSegmentsBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$,this.plantSearchSelected,this.productSectionSearchSelected)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection,plantSelected,productSectionSelected]) => {


        if(plantSelected!=''){
          changedHeroData=changedHeroData.filter(row=>plantSelected == row.plant)

          if(productSectionSelected!=''){
            changedHeroData=changedHeroData.filter(row=>productSectionSelected == row.productSection)
          }
        }

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
  loadSegments() {
    this.structureService.getAllSegments().subscribe(
      (res: SegmentResponse[]) => {
        this.segmentTableService.setSegmentsBS(res)
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

  selectPlant(value:any){
    this.plantSearchSelected.next(value.target.value)
    this.productSectionSearchSelected.next("")
    this.productSectionNames= this.segmentTableService.getPSsNamesByPlant(value.target.value)
  }
  selectProductSection(value:any){
    this.productSectionSearchSelected.next(value.target.value)
  }

  deleteSegment(id:number){
    this.segmentService.deleteSegment(id).subscribe(
      ()=>{
        this.toastrService.success("supprimé");
        this.segmentTableService.deleteSegment(id)
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
        this.deleteSegment(this.appointmentIdToDelete)

      }
    }
    this.deleteConfirmationDialogHidden = true;
  }
}
