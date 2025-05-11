 import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, take} from "rxjs";
import {FormControl} from "@angular/forms";
import {RolesService} from "../../../services/roles.service";
import {initFlowbite} from "flowbite";
import {UserResponse} from "../../../models/user-response";
import {RoleResponse} from "../../../models/roles/role-response";
import {RolesTableService} from "../../services/roles-table.service";
import {EditUserDetailsComponent} from "../../../users/edit-user-details/edit-user-details.component";
import {EditRoleDetailsComponent} from "../../edit-role-details/edit-role-details.component";
 import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.css'
})
export class RolesTableComponent  implements OnInit,AfterViewInit {
  @ViewChild(EditRoleDetailsComponent) editRoleDetailsComponent!:EditRoleDetailsComponent;

  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "name",
    "description",
    "nbUsers",
    "actions"

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');

  /// delete confirmation dialog
  deleteConfirmationDialogHidden=true
 deleteConfirmationDialogTitle="Supprimer le rôle"
deleteConfirmationDialogMessage="Êtes-vous sûr ?"
deleteConfirmationDialogConfirmBtnText= "Supprimer"
toDeleteRoleId=-1

/// duplicate confirmation dialog
duplicateConfirmationDialogHidden=true
duplicateConfirmationDialogTitle="Dupliquer le rôle"
duplicateConfirmationDialogMessage="Êtes-vous sûr ?"
duplicateConfirmationDialogConfirmBtnText= "Dupliquer"
toDuplicateRoleName=""
  constructor(
    private rolesService:RolesService,
    private rolesTableService:RolesTableService,
    private toastr:ToastrService
  ) { }

  ngAfterViewInit(): void {
    }
  ngOnInit(): void {
    initFlowbite()
    this.loadRoles()

    {


    // table base functions
    // data size
    this.rolesTableService.getRolesBS().subscribe(changedHeroData => {
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

    this.rolesTableService.getRolesBS().pipe(take(1)).subscribe(heroData => {
      this.tableDataSource$.next(Object.values(heroData));
    });
    // Search and sort
    combineLatest(this.rolesTableService.getRolesBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$)
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

        const sortedHeroes = filteredHeroes.sort((a, b) => {
          if(a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          if(a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          return 0;
        });

        this.tableDataSource$.next(sortedHeroes);
      });

    this.searchFormControl.setValue('');
    }
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


  deleteRole(id:number){
    this.toDeleteRoleId=id
    this.deleteConfirmationDialogHidden=false
  }
  confirmDelete(isConfirmed:boolean){
    if(isConfirmed){
      this.rolesService.deleteRole(this.toDeleteRoleId)
      .subscribe(
(val)=> {
    this.toastr.success("Rôle supprimé")
    this.rolesTableService.deleteRoleFromData(this.toDeleteRoleId)
}
,error=>{


}
        )

    }
    this.deleteConfirmationDialogHidden=true
  }

  duplicateRole(name:string){
    this.toDuplicateRoleName=name
    this.duplicateConfirmationDialogHidden=false
  }
  confirmDuplication(isConfirmed:boolean){
    if(isConfirmed){
      this.rolesService.duplicateRole(this.toDuplicateRoleName)
        .subscribe(
          (role)=> {
            this.toastr.success("Rôle dupliqué")
            this.rolesTableService.addRole(role)
          }
          ,error=>{


          }
        )

    }
    this.duplicateConfirmationDialogHidden=true
  }

  ///// Logic
  loadRoles() {
    this.rolesService.getAllRoles().subscribe((res: RoleResponse[]) => {
      this.rolesTableService.setRolesBS(res)

    });
  }

  roleToModify:RoleResponse={}

  protected readonly alert = alert;
  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-roles-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }
}
