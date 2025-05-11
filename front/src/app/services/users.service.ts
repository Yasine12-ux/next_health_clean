import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {FullUserResponse,UserResponse} from "../models/user-response";
import {TokenStorageService} from "./auth-services/token-storage.service";
import {catchError, throwError} from "rxjs";
import {StructureMiniResponse} from "../structures/models/StructureMiniResponse";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.apiUrlUsers

  constructor(private http:HttpClient,private tokenStorage:TokenStorageService) { }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set("Authorization", `Bearer ${this.tokenStorage.getToken()}`);
  }
  getAllUsers(){
    return this.http.get<UserResponse[]>(`${this.baseUrl}/users`,{headers: this.getHeaders()})
  }

  getUser(id:number){
    return this.http.get<FullUserResponse>(`${this.baseUrl}/user/${id}`)
  }

  /***
   ## status :
   ### true: set user enable
   ### false: set user disable
   ## return the new val of status (true or false)
   */
  changeUserStatus(id:number,status:boolean){
    return this.http.patch(`${this.baseUrl}/user/${id}/${status}`,{})
  }

  changeUserArchiveStatus(id:number,isArchive:boolean){
    return this.http.patch(`${this.baseUrl}/user/archived/${id}/${isArchive}`,{})
  }
  // deleteUser(id:number){
  //   return this.http.delete(`${this.baseUrl}/user/${id}`)
  // }
  modifyUser(userResponse:FullUserResponse){
    return this.http.put(`${this.baseUrl}/user`,userResponse)
  }


  // getUserByMail(mail:string){
  //   return this.http.get<UserResponse>(`${this.baseUrl}/user/email/${mail}`)
  // }
  getImage(email: string) {

    return this.http.get(`${this.baseUrl}/get-image/${email}`, { responseType: 'blob' });
  }

  uploadImage(email: string, file: File) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', file);

    return this.http.post(`${this.baseUrl}/upload-image/${email}`, formData);

  }

  changeImage(email: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.put(`${this.baseUrl}/change-image/${email}`, formData);
  }
  createManyUsers(users:any){
    return this.http.post<UserResponse[]>(`${this.baseUrl}/many-users`,users)
  }

  getSegmentsByRh(){
    return this.http.get<StructureMiniResponse[]>(`${this.baseUrl}/rh-segments`)
  }

}
