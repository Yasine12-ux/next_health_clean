import {Component} from '@angular/core';
import {BehaviorSubject, combineLatest, forkJoin} from "rxjs";
import {FormControl} from "@angular/forms";
import {FichePatientService} from "../../service/fiche-patient.service";
import {FichePatientTableService} from "../../service/tables/fiche-patient-table.service";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../services/users.service";
import {RecordsService} from "../../service/records.service";
import {Router} from "@angular/router";
import {initFlowbite} from "flowbite";
import {FichePatientResponse} from "../../models/FichePatientResponse";
interface filterParams{show_APlus:boolean,show_AMoin:boolean,show_BPlus:boolean,show_BMoin:boolean,show_ABPlus:boolean,show_ABMoin:boolean,show_OPlus:boolean,show_OMoin:boolean,Null:boolean}

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrl: './dossier.component.css'
})



export class DossierComponent {

  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "name",
    "prenom",
    "ordonnacesCount",
    "consultationsCount",
    "examensCount",
    'Action'
  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');
  filterParamsVar:filterParams={show_APlus:true,show_AMoin:true,show_BPlus:true,show_BMoin:true,show_ABPlus:true,show_ABMoin:true,show_OPlus:true,show_OMoin:true,Null:true}

  statusFilter$ =new BehaviorSubject<filterParams>(this.filterParamsVar)



  constructor(
    private fichePatientService: FichePatientService,
    private fichePatientTableService: FichePatientTableService,


    private recordsService: RecordsService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {}


  //

  ngOnInit() {
    initFlowbite()

    this.loadFichePatient()
    // table base functions
    // data size
    this.fichePatientTableService.getFichePatientBS().subscribe(changedHeroData => {
      this.tableDataSource$.subscribe(data=>{

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
    combineLatest(this.fichePatientTableService.getFichePatientBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$,this.statusFilter$)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection,filters]) => {

        changedHeroData = (changedHeroData).filter((patient :any)=> {
          let gS = "";
          if (patient.groupeSanguin==null) {
            gS = "null";
          }
          return ((patient.groupeSanguin== "A_POSITIF" &&filters.show_APlus) || (patient.groupeSanguin== "A_NEGATIF" &&filters.show_AMoin) || (patient.groupeSanguin== "B_POSITIF" &&filters.show_BPlus) || (patient.groupeSanguin== "B_NEGATIF" &&filters.show_BMoin) || (patient.groupeSanguin== "AB_POSITIF" &&filters.show_ABPlus) || (patient.groupeSanguin== "AB_NEGATIF" &&filters.show_ABMoin) || (patient.groupeSanguin== "O_POSITIF" &&filters.show_OPlus) || (patient.groupeSanguin== "O_NEGATIF" &&filters.show_OMoin)
          || (filters.Null && gS=="null"));
        })

        const heroesArray = Object.values(changedHeroData);
        let filteredHeroes: any[];
        if (!searchTerm) {
          filteredHeroes = heroesArray;
        } else {
          filteredHeroes = heroesArray.filter(hero => {
            return Object.values(hero)
              .reduce((prev, curr) => {
                return prev || curr?.toString().toLowerCase().includes(searchTerm.toLowerCase());
              }, false);
          });
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

  changeStatusFilter(){
    this.currentPage$.next(1)
    this.statusFilter$.next(this.filterParamsVar)
  }
  changePageSize$(nbPage:number){
    this.pageSize$.next(nbPage)
    this.changeCurrentPage(1)
  }


  ///// Logic
loadFichePatient() {
  this.fichePatientService.getAllFichePatient().subscribe((fiches:any) => {
      console.log(fiches)
    const dossierObservables = fiches.map((fiche:any) => this.recordsService.getDossierTable(fiche.userId));
    forkJoin(dossierObservables).subscribe((dossiers:any) => {
      console.log(dossiers)
      this.fichePatientTableService.setFichePatientBS(dossiers);
    });
  });
}

  fiche(id: number,nom:string,prenom:string) {
    if(nom!=null && prenom!=null) {
      prenom = prenom.replace(" ", "-")
      nom = nom.replace(" ", "-")
    }else
    {
      prenom = "..."
      nom = "..."
    }


    this.router.navigateByUrl("/home/medical-records/dossier/"+id+"/"+nom+"-"+prenom+"/overview-fiche" )

  }

  protected readonly alert = alert;

  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-user-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }


}
