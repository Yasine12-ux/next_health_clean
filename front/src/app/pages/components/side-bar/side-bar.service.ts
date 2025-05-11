import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private sideBarOpened= new BehaviorSubject<boolean>(true)

  private permissionClickedNavigateTo=new BehaviorSubject<String>("")

  getState():Observable<boolean>{
    return this.sideBarOpened.asObservable();
  }
  setState(state:boolean){
    this.sideBarOpened.next(state)
  }

  getPermissionClickedNavigateTo():Observable<String>{
    return this.permissionClickedNavigateTo.asObservable();
  }

  setPermissionClickedNavigateTo(permission:String){
    this.permissionClickedNavigateTo.next(permission)
  }
}
