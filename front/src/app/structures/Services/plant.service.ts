import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PlantSimpleResponse} from "../models/PlantSimpleResponse";
import {PlantResponse} from "../models/PlantResponse";
import {ProductSectionResponse} from "../models/ProductSectionResponse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(private http: HttpClient) {
  }

  baseUrl = environment.apiUrlStructures+'/plants';

  createPlant(name: any) {
    return this.http.post<PlantSimpleResponse>(this.baseUrl + "/plant/" + name, {});

  }
  findAllPlants(){
    return this.http.get<PlantResponse[]>(this.baseUrl+"/plants")
  }
  deletePlant(id: number){
    return this.http.delete(this.baseUrl+"/plant/"+id)
  }
  updatePlant(data: any){
    return this.http.put<PlantResponse>(this.baseUrl+"/plant ",data)
  }
  getProductSectionbyplantId(id: any) {
    return this.http.get<ProductSectionResponse[]>(this.baseUrl + "/plant-product-sections/" + id);
  }

  getAllPlantsMini() {
    return this.http.get<PlantSimpleResponse[]>(this.baseUrl + "/plants-mini" );
  }

}
