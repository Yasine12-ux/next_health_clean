import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {UserResponse} from "../../models/user-response";
import {UsersService} from "../../services/users.service";

@Injectable({
  providedIn: 'root'
})
export class UserTableService {


  private _usersBS = new BehaviorSubject<UserResponse[]>([]);

  getUsersBS():BehaviorSubject<UserResponse[]>{
    return this._usersBS;
  }
  setUsersBS(data: UserResponse[]) {
    this._usersBS.next(data);
  }
  archiveUserFromData(toArchiveUserId: number,userNewStatus:boolean) {

    this._usersBS.forEach(rows => {
      rows.forEach((row, index) => {
        if (row.id === toArchiveUserId) {
          row.isArchived=userNewStatus
        }
      });
    });
    this.setUsersBS(this._usersBS.value)
  }

  changeUserStatusByEmail(id: number, status: boolean) {

    this._usersBS.forEach(
      x=>{
        x.forEach(
          row=>{
            if(row.id==id)
              row.isEnable = status
          }
        )
      }
    )
  }

  addUser(user:UserResponse){
    const newList=  this._usersBS.getValue()
    newList.push(user)
    this._usersBS.next(newList)
  }
  modifyUser(user:UserResponse){
    const updatedUsers = this._usersBS.value.map(row => {
      if (row.id === user.id) {
        return user; // Replace the row with the updated user
      } else {
        return row; // Return unchanged row for other users
      }
    });

    this.setUsersBS(updatedUsers);
  }

  addManyusers(data: UserResponse[]) {
    const newList=  this._usersBS.getValue()
    for (const user of data) {
      newList.push(user)
    }
    this.setUsersBS(newList)
  }
  constructor() { }
}
