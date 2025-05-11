import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {ConsultationResponse} from "../models/ConsultationResponse";
import {HttpClient} from "@angular/common/http";
import {AiRequest} from "../models/AiRequest";
import {AiResponce} from "../models/AiResponce";

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private baseUrl = environment.apiUrlAI

  constructor(private http:HttpClient) { }
  recommend(aiRequest:AiRequest)
  {
    return this.http.post<AiResponce>(`${this.baseUrl}/predict/`,aiRequest);
  }

  train(aiRequest:AiRequest)
  {
    return this.http.post(`${this.baseUrl}/train/`,aiRequest);
  }

}
