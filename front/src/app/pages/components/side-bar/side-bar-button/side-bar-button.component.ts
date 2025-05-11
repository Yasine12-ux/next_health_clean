import {booleanAttribute, Component, EventEmitter, Input, numberAttribute, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {SideBarService} from "../side-bar.service";
import {select} from "@ngrx/store";

@Component({
  selector: 'app-side-bar-button',
  templateUrl: './side-bar-button.component.html',
  styleUrl: './side-bar-button.component.css'
})
export class SideBarButtonComponent implements OnInit{
  @Input({transform: numberAttribute})  maximized:number=1;
  @Input() name:string="";
  @Input() icon:string="";
  @Input({transform: numberAttribute}) notificationNumber:number=0;
  @Input() navigateTo:string="";
  @Input() confirmationMessage:string="";
  @Output()click:EventEmitter<any>=new EventEmitter<any>()

  selected: boolean= false

  constructor(private router:Router,
              private sideBarService:SideBarService
              ) {
  }
  ngOnInit() {
    this.sideBarService.getPermissionClickedNavigateTo().subscribe((permission)=>{
      this.selected = permission == this.navigateTo;
    })
  }

  clickHandler(){
    this.click.emit()
    if(this.confirmationMessage){
      const confirmed = confirm(this.confirmationMessage);
      if (confirmed){
        this.sideBarService.setPermissionClickedNavigateTo(this.navigateTo)
          this.router.navigate([this.navigateTo])
      }
    }else{
      this.sideBarService.setPermissionClickedNavigateTo(this.navigateTo)
      this.router.navigate([this.navigateTo])
    }

  }


  protected readonly select = select;
}
