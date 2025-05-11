import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 baseUrl = environment.apiUrlNotification;
  constructor(private http:HttpClient) { }

    getAllUnreadNotification(email:any){
    return this.http.get(this.baseUrl + '/notificationsFalse/' + email);
    }
    getAllNotification(email:any){
    return this.http.get(this.baseUrl + '/all/' + email);
    }
    markAsRead(id:any){
    return this.http.put(this.baseUrl + '/change/'+id, {});
    }
}
