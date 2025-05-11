import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, switchMap, take, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {initFlowbite} from "flowbite";
import {LineTableService} from "../../../Services/tables-services/line-table.service";
import {LineResponse} from "../../../models/LineResponse";
import {ToastrService} from "ngx-toastr";
import {LineService} from "../../../Services/line.service";
import {EditLineComponent} from "../edit-line/edit-line.component";
import {StructuresService} from "../../../structures.service";


interface filterParams{show_archive:boolean,show_enabled:boolean,show_disabled:boolean}
@Component({
  selector: 'structure-line-table',
  templateUrl: './line-table.component.html',
  styleUrl: './line-table.component.css'
})
export class LineTableComponent implements OnInit,AfterViewInit {
  @ViewChild(EditLineComponent) editLineComponent!: EditLineComponent;
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "lineName",
    "manager",
    "nbWorkers",
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

  segmentNames:string[]=[]
  segmentSearchSelected:BehaviorSubject<string>=new BehaviorSubject<string>("")



  constructor(
    private structureService:StructuresService,
    private lineTableService:LineTableService,
    private lineService:LineService,
    private toastrService:ToastrService

  ) { }

  ngAfterViewInit(): void {}

  ngOnInit() {
    initFlowbite()

    this.loadLines()

    this.lineTableService.getPlantsNames().subscribe({
      next: (data) => {
        this.plantsNames = data

      }
    })


    this.lineTableService.getLinesBS().subscribe({
      next:(data)=>{
        this.dataSize=data.length      }
    })

    // pagination
    combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
      .subscribe(([allSources, currentPage, pageSize]) => {
        const startingIndex = (currentPage - 1) * pageSize;
        const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
        this.dataOnPage$.next(onPage);
      });

    // Search and sort
    combineLatest(this.lineTableService.getLinesBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$,this.plantSearchSelected,this.productSectionSearchSelected,this.segmentSearchSelected)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection,plantSelected,productSectionSelected,segmentSearchSelected]) => {

        if(plantSelected!=''){
          changedHeroData=changedHeroData.filter(row=>plantSelected == row.plant)

          if(productSectionSelected!=''){
            changedHeroData=changedHeroData.filter(row=>productSectionSelected == row.productSection)

            if(segmentSearchSelected!=''){
              changedHeroData=changedHeroData.filter(row=>segmentSearchSelected == row.segmentName)
            }
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
  loadLines() {
    this.structureService.getAllLines().subscribe(
      (res: LineResponse[]) => {
        this.lineTableService.setLinesBS(res)

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
    this.segmentSearchSelected.next("")
    this.productSectionNames= this.lineTableService.getPSsNamesByPlant(value.target.value)

  }
  selectProductSection(value:any){
    this.productSectionSearchSelected.next(value.target.value)
    this.segmentSearchSelected.next("")
    this.segmentNames=this.lineTableService.getSegmentsNamesByPS(value.target.value)
  }

  selectSegment(value:any){
    this.segmentSearchSelected.next(value.target.value)
  }
  deleteLine(id:number){
    this.lineService.deleteLine(id).subscribe(
      ()=>{
 this.toastrService.success("supprimé");
this.lineTableService.deleteLine(id)
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
        this.deleteLine(this.appointmentIdToDelete)

      }
    }
    this.deleteConfirmationDialogHidden = true;
  }

}
