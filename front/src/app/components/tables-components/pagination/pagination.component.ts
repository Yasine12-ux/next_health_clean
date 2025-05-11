import {Component, EventEmitter, Input, numberAttribute, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
  imports: [
    CommonModule
  ],
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit{

  @Input({transform:numberAttribute}) collectionSize=1
  @Input({transform:numberAttribute}) pageSize=1
  @Output()pageChange  = new EventEmitter<number>();
  @Input({transform:numberAttribute})currentPage:number=1;

  ngOnInit(): void {
    this.pageChange.emit(this.currentPage)
  }

  nextPage():void{
    if (this.currentPage<(this.collectionSize/this.pageSize)) {
      this.currentPage++
      this.pageChange.emit(this.currentPage)
    }
  }
  lastPage():void{
    if (this.currentPage>1) {
      this.currentPage--
      this.pageChange.emit(this.currentPage)

    }
  }

  setPage(page:number):void{
    this.currentPage=page;
    this.pageChange.emit(this.currentPage)

  }

  removeComma(n:number){
    const afterComma = n%1
    n= n-afterComma + (afterComma>0?1:0)
    return n
  }

}
