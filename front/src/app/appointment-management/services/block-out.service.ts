import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppointmentResponse} from "../models/AppointmentResponse";
import {BlockOutResponse} from "../models/BlockOutResponse";
import {BlockOutRequest} from "../models/BlockOutRequest";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BlockOutService {
  private baseUrl = environment.apiUrlBlockOut

  constructor(private http:HttpClient) {}
  findAll(){
    return this.http.get<BlockOutResponse[]>(`${this.baseUrl}/all`)
  }
  update(blockOutResponse:BlockOutResponse){
    return this.http.put<BlockOutResponse>(`${this.baseUrl}`,blockOutResponse)
  }
  create(blockOutResponse:BlockOutRequest){
    return this.http.post<BlockOutResponse>(`${this.baseUrl}`,blockOutResponse)
  }
  delete(id:number){
    return this.http.delete(`${this.baseUrl}/${id}`)
  }

}
