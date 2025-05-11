import {Component, OnInit, ViewChild} from '@angular/core';
import {Notifications} from "../model/Notifications";
import {WebSocketService} from "../../services/web-socket.service";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import {NotificationService} from "../../services/NotifService/notification.service";
import {initFlowbite} from "flowbite";
import {BehaviorSubject, combineLatest, take} from "rxjs";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-notif-table',
  templateUrl: './notif-table.component.html',
  styleUrl: './notif-table.component.css'
})
export class NotifTableComponent implements OnInit{


  constructor(private tokenService:TokenStorageService,private notificationService:NotificationService) { }




  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([

    "message",
    "time",

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize=0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');

  ngOnInit(): void {
    initFlowbite()
    this.notificationService.getAllNotification(this.tokenService.getUser().sub).subscribe(changedHeroData => {
      this.tableDataSource$.subscribe(data=>{
        this.dataSize=data.length
      })
    });
    combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
      .subscribe(([allSources, currentPage, pageSize]) => {
        const startingIndex = (currentPage - 1) * pageSize;
        const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
        this.dataOnPage$.next(onPage);
      });

    this.notificationService.getAllNotification(this.tokenService.getUser().sub).pipe(take(1)).subscribe(heroData => {
      // Convert heroData to an array and reverse it
      let reversedHeroData = Object.values(heroData).reverse();

      // Use spread operator to prepend reversedHeroData to tableDataSource$
      this.tableDataSource$.next([...reversedHeroData, ...this.tableDataSource$.getValue()]);
    });


    combineLatest(this.notificationService.getAllNotification(this.tokenService.getUser().sub), this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$)
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
          if(a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          if(a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
        this.tableDataSource$.next([]);
        this.tableDataSource$.next(sortedHeroes);
      });

    this.searchFormControl.setValue('');

  }
   removeDuplicates(array: any[], key: string) {
    return array.filter((item, index, self) =>
      index === self.findIndex(obj => obj[key] === item[key])
    );
  }
  ngAfterViewInit(): void {
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






  protected readonly alert = alert;
  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-notification-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    // Call your function to handle page size change
    this.changePageSize$(i);
  }

}
