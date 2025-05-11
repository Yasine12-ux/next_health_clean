import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UserResponse} from "../../models/user-response";
import {RoleResponse} from "../../models/roles/role-response";

@Injectable({
  providedIn: 'root'
})
export class RolesTableService {
  private _rolesBS = new BehaviorSubject<RoleResponse[]>([]);
  getRolesBS():BehaviorSubject<RoleResponse[]>{
    return this._rolesBS;
  }
  setRolesBS(data: RoleResponse[]) {
    this._rolesBS.next(data);
  }

  deleteRoleFromData(toDeleteRoleId: number) {
    this._rolesBS.forEach(rows => {
      rows.forEach((row, index) => {
        if (row.id === toDeleteRoleId) {
          rows.splice(index, 1); // Remove the row at the current index
        }
      });
    });
    this.setRolesBS(this._rolesBS.value)
  }
  addRole(role:RoleResponse){
    const newList=  this._rolesBS.getValue()
    newList.push(role)
    this._rolesBS.next(newList)
  }

  modifyRole(role: RoleResponse) {
    const updatedRoles = this._rolesBS.value.map(row => {
      if (row.id === role.id) {
        return role; // Replace the row with the updated user
      } else {
        return row; // Return unchanged row for other users
      }
    });
  this.setRolesBS(updatedRoles)
  }
}
