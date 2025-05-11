import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, switchMap, take, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {initFlowbite} from "flowbite";
import {ProductSectionResponse} from "../../../models/ProductSectionResponse";
import {ProductSectionTableService} from "../../../Services/tables-services/product-section-table.service";
import {ProductSectionService} from "../../../Services/product-section.service";
import {ToastrService} from "ngx-toastr";
import {EditProductSectionComponent} from "../edit-product-section/edit-product-section.component";
import {StructuresService} from "../../../structures.service";


interface filterParams{show_archive:boolean,show_enabled:boolean,show_disabled:boolean}
@Component({
  selector: 'structure-product-section-table',
  templateUrl: './product-section-table.component.html',
  styleUrl: './product-section-table.component.css'
})
export class ProductSectionTableComponent implements OnInit,AfterViewInit {

  @ViewChild(EditProductSectionComponent) editProductSectionComponent!: EditProductSectionComponent;
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "name",
    "plantName",
    "manager",
    "SegmentCount",
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

  constructor(
    private structureService:StructuresService,
    private productSectionTableService:ProductSectionTableService,
    private productSectionService:ProductSectionService,
    private toastrService:ToastrService

  ) { }

  ngAfterViewInit(): void {}

  ngOnInit() {
    initFlowbite()
    this.loadProductSections()

    this.productSectionTableService.getPlantsNames().subscribe({
      next:(data)=>{
        this.plantsNames = data
    }
    })
    this.productSectionTableService.getPsBS().subscribe({
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
    combineLatest(this.productSectionTableService.getPsBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$,this.plantSearchSelected)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection,plantSelected]) => {

        if(plantSelected!=''){
          changedHeroData=changedHeroData.filter(row=>plantSelected == row.plantName)
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
  loadProductSections() {
    this.structureService.getAllProductSections().subscribe(
      (res: ProductSectionResponse[]) => {
        this.productSectionTableService.setPssBS(res)
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
  }

  deleteProductSection(id:number){
    this.productSectionService.deleteProductSection(id).subscribe(
      ()=>{
this.toastrService.success("supprimé");
this.productSectionTableService.deleteProductSection(id)
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
        this.deleteProductSection(this.appointmentIdToDelete)

      }
    }
    this.deleteConfirmationDialogHidden = true;
  }

  protected readonly onchange = onchange;
}
