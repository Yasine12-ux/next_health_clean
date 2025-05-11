import {Component, OnInit} from '@angular/core';
import {FichePatientService} from "../service/fiche-patient.service";
import {FichePatientTableService} from "../service/tables/fiche-patient-table.service";
import {BehaviorSubject, combineLatest} from "rxjs";
import {FormControl} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {UserTableService} from "../../users/service/user-table.service";
import {ToastrService} from "ngx-toastr";
import {initFlowbite} from "flowbite";
import {UserResponse} from "../../models/user-response";
import {ProductSectionResponse} from "../../structures/models/ProductSectionResponse";
import {StructureMiniResponse} from "../../structures/models/StructureMiniResponse";
import {UserStructureResponse} from "../../structures/models/UserStructureResponse";
import {LineService} from "../../structures/Services/line.service";
import {ProductSectionService} from "../../structures/Services/product-section.service";
import {PlantService} from "../../structures/Services/plant.service";
import {PlantSimpleResponse} from "../../structures/models/PlantSimpleResponse";
import {SegmentService} from "../../structures/Services/segment.service";
import {RecordsService} from "../service/records.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-fiche-patient-table',
  templateUrl: './fiche-patient-table.component.html',
  styleUrl: './fiche-patient-table.component.css'
})
export class FichePatientTableComponent implements OnInit{

  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "nom",
    "prenom",
    "dateNaissance",
    "cin",
    "sexe",

    'Action'
  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');


  plants:PlantSimpleResponse[]=[]


  selectedPsId: number=0;
  Pss: ProductSectionResponse[]=[]

  selectedSegmentId: number=0;
  segments: StructureMiniResponse[]=[]

  selectedLineId: number=0;
  lines: StructureMiniResponse[]=[]

  workers: UserStructureResponse[]=[]
  constructor(
    private fichePatientService: FichePatientService,
    private fichePatientTableService: FichePatientTableService,
    private toastr: ToastrService,
    private usersService:UsersService,
    private lineService:LineService,
    private segmentService:SegmentService,
    private productSectionService:ProductSectionService,
    private plantService:PlantService,
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
    combineLatest(this.fichePatientTableService.getFichePatientBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$)
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
  loadFichePatient() {
    this.fichePatientService.getAllFichePatient().subscribe((fiches) => {
     console.log(fiches)
      fiches.forEach((fiche) => {
        if (!fiche.nom || !fiche.prenom) {
          this.usersService.getUser(fiche.userId).subscribe((userData) => {
            const user = userData.userInfo;
            console.log(user)
            if (user.firstname != null) {
              fiche.nom = user.firstname;
            }
            if (user.lastname != null) {
              fiche.prenom = user.lastname;
            }
            this.fichePatientTableService.setFichePatientBS(fiches); // Set the updated data here or after the loop
          });
        }
      });
      this.fichePatientTableService.setFichePatientBS(fiches); // Ensure this is called once
    });
  }

  fiche(id: number,nom:string,prenom:string) {
        prenom=prenom.replace(" ","-")
        nom=nom.replace(" ","-")

        this.router.navigateByUrl("/home/medical-records/fiche-patient/"+id+"/"+nom+"-"+prenom)
  }

  protected readonly alert = alert;

  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-user-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }







}
