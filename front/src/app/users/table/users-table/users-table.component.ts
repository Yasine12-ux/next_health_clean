import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, switchMap, take, tap} from "rxjs";
import {map} from "rxjs";
import {FormControl} from "@angular/forms";
import {initFlowbite} from "flowbite";
import {UsersService} from "../../../services/users.service";
import {FullUserResponse, UserResponse} from "../../../models/user-response";
import {list} from "postcss";
import {UserTableService} from "../../service/user-table.service";
import {EditUserDetailsComponent} from "../../edit-user-details/edit-user-details.component";
import {ToastrService} from "ngx-toastr";


interface filterParams{show_archive:boolean,show_enabled:boolean,show_disabled:boolean}
@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit,AfterViewInit {
  @ViewChild(EditUserDetailsComponent) editUserDetailsComponent!: EditUserDetailsComponent;
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    "firstname",
    "lastname",
    "email",
    "phone",
    "role",
    "isEnable",
    'Action'

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');


  filterParamsVar:filterParams={"show_archive":false,"show_disabled":true,"show_enabled":true}
  statusFilter$ =new BehaviorSubject<filterParams>(this.filterParamsVar)

  /// delete confirmation dialog
  archiveConfirmationDialogHidden=true
  archiveConfirmationDialogTitle="Archive User"
  archiveConfirmationDialogMessage="Are you sure?"
  archiveConfirmationDialogConfirmBtnText= "Archive"
  userOldArchivedStatus:boolean=false;
  userIdArchive=-1

  constructor(
    private usersService:UsersService,
    private userTableService:UserTableService,
    private toastr:ToastrService
  ) { }

  ngAfterViewInit(): void {}

  archiveUser(id:number,userOldArchivedStatus:boolean){
    this.userOldArchivedStatus=userOldArchivedStatus
    this.userIdArchive=id
    this.archiveConfirmationDialogHidden=false

    if(!userOldArchivedStatus){
      this.archiveConfirmationDialogTitle="Archive User"
      this.archiveConfirmationDialogConfirmBtnText= "Archive"
    }else{
      this.archiveConfirmationDialogTitle="Restore User"
      this.archiveConfirmationDialogConfirmBtnText= "Restore"
    }

  }
  confirmArchiveStatus(isConfirmed:boolean){
    if(isConfirmed){
      this.usersService.changeUserArchiveStatus(this.userIdArchive,!this.userOldArchivedStatus)
        .subscribe(
          (val)=> {
            this.userTableService.archiveUserFromData(this.userIdArchive,!this.userOldArchivedStatus)
            if (this.userOldArchivedStatus){
              this.toastr.success("User restored")
            }else
            this.toastr.success("User archived ")
          }
          ,(error)=>{


          }

        )

    }
    this.archiveConfirmationDialogHidden=true
  }

  /// Disable confirmation dialog
  changeUserStatusConfirmationDialogHidden=true
  changeUserStatusConfirmationDialogTitle="Disable User"
  changeUserStatusConfirmationDialogMessage="Are you sure?"
  changeUserStatusConfirmationDialogConfirmBtnText= "Disable"
  userOldStatus:boolean=false;
  userIdStatus=-1
  changeUserStatus(id:number,oldStatus:boolean){
    this.userOldStatus=oldStatus
    this.userIdStatus=id
    this.changeUserStatusConfirmationDialogHidden=false

    if(!oldStatus){
      this.changeUserStatusConfirmationDialogTitle ="Enable User"
      this.changeUserStatusConfirmationDialogConfirmBtnText="Enable"
    }else{
      this.changeUserStatusConfirmationDialogTitle ="Disable User"
      this.changeUserStatusConfirmationDialogConfirmBtnText="Disable"
    }


  }
  confirmChangeUserStatus(isConfirmed:boolean){
    if(isConfirmed){
      this.usersService.changeUserStatus(this.userIdStatus,!this.userOldStatus)
        .subscribe(
          (val)=> {

            this.userTableService.changeUserStatusByEmail(this.userIdStatus,!this.userOldStatus)
this.toastr.success("Le statut de l'utilisateur a changé")          }
          ,error=>{
          })
    }
    this.changeUserStatusConfirmationDialogHidden=true
  }

  //

  ngOnInit() {
    initFlowbite()

    this.loadUsers()
    // table base functions
    // data size
    this.userTableService.getUsersBS().subscribe(changedHeroData => {
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
    combineLatest(this.userTableService.getUsersBS(), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$,this.statusFilter$)
      .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection,filters]) => {

        changedHeroData = changedHeroData.filter(user=>
          (user.isEnable && filters.show_enabled && !user.isArchived) || (!user.isEnable && filters.show_disabled && !user.isArchived)  || (user.isArchived && filters.show_archive))

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

  changeStatusFilter(){
    this.currentPage$.next(1)
    this.statusFilter$.next(this.filterParamsVar)
  }

  changePageSize$(nbPage:number){
    this.pageSize$.next(nbPage)
    this.changeCurrentPage(1)
  }


  ///// Logic
  loadUsers() {
    this.usersService.getAllUsers().subscribe((res: UserResponse[]) => {
      this.userTableService.setUsersBS(res)
    });
  }


  protected readonly alert = alert;

  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-user-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }

  showEditUser(user:UserResponse) {
    if(!user.id) return
    this.usersService.getUser(user.id).subscribe(
      data=>{
        this.editUserDetailsComponent.showDrawer(data);

      }
    )
  }
}
