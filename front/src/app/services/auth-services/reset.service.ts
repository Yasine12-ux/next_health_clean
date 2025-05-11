import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ResetService {
  private baseUrl = environment.apiUrlUsers
  constructor(private http:HttpClient) { }

  checkEmail(email: any){

    return this.http.post(`${this.baseUrl}/checkEmail`, email)
  }
  sendEmail(email: any){

    return this.http.post(`${this.baseUrl}/reset`, email)
  }
  checkCode(data: any){
    return this.http.post(`${this.baseUrl}/checkCode`, data)
  }
  changeResetpass(data: any){
    return this.http.post(`${this.baseUrl}/changeResetPassword`, data)
  }
changePass(data: any) {
  return this.http.post(`${this.baseUrl}/changePassword`, data)
}
}
