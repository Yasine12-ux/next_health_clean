import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RoleResponse} from "../models/roles/role-response";
import {Permission} from "../models/roles/permission";
import {RoleRequest} from "../models/roles/RoleRequest";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private baseUrl = environment.apiUrlRoles

  constructor(private http:HttpClient) { }


  getAllRolesNamePermissions(name: string){
    return this.http.get<RoleResponse[]>(`${this.baseUrl}/roleName/${name}`)
  }
  getAllRolesNames(){
    return this.http.get<string[]>(`${this.baseUrl}/names`)
  }
  getAllRoles(){
    return this.http.get<RoleResponse[]>(`${this.baseUrl}/all`)
  }

  deleteRole(toDeleteRoleId: number) {
    return this.http.delete<RoleResponse[]>(`${this.baseUrl}/role/${toDeleteRoleId}`)
  }
  duplicateRole(toDuplicateRoleName: string) {
    return this.http.post<RoleResponse>(`${this.baseUrl}/role/${toDuplicateRoleName}`,null)
  }
  createRole(role: RoleRequest) {
    return this.http.post<RoleResponse>(`${this.baseUrl}/role`,role)
  }
  modifyRole(role: RoleResponse) {
    return this.http.put<RoleResponse>(`${this.baseUrl}/role`,role)
  }


  getAllPermissions(){
    return this.http.get<Permission[]>(`${this.baseUrl}/permissions`)
  }




}
