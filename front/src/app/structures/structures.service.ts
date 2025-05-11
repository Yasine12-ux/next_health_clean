import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PlantResponse} from "./models/PlantResponse";
import {ProductSectionResponse} from "./models/ProductSectionResponse";
import {SegmentResponse} from "./models/SegmentResponse";
import {LineResponse} from "./models/LineResponse";

@Injectable({
  providedIn: 'root'
})
export class StructuresService {
  private baseUrl = environment.apiUrlStructures
  private plantPath ="/plants"
  private psPath ="/product-sections"
  private segmentPath ="/segments"
  private linePath ="/lines"
  constructor(private http:HttpClient) {}

  /**
   * Plant
   */
  getAllPlants(){
    return this.http.get<PlantResponse[]>(`${this.baseUrl}${this.plantPath}/plants`)
  }

  /**
   * Product Section
   */
  getAllProductSections(){
    return this.http.get<ProductSectionResponse[]>(`${this.baseUrl}${this.psPath}/product-sections`)
  }

  getAllSegments(){
    return this.http.get<SegmentResponse[]>(`${this.baseUrl}${this.segmentPath}/all-segments`)
  }

  getAllLines(){
    return this.http.get<LineResponse[]>(`${this.baseUrl}${this.linePath}/lines`)
  }


}
