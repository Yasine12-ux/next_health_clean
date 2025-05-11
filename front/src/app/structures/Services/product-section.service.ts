import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductSectionSimpleResponse} from "../models/ProductSectionSimpleResponse";
import {ProductSectionResponse} from "../models/ProductSectionResponse";
import {SegmentResponse} from "../models/SegmentResponse";
import {StructureMiniResponse} from "../models/StructureMiniResponse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductSectionService {
  baseUrl = environment.apiUrlStructures+'/product-sections';
  constructor( private http : HttpClient) { }


  createProduct(data: any){
    return this.http.post<ProductSectionSimpleResponse>(this.baseUrl+"/product-section",data);
  }
  createManyProduction(data: any){
    return this.http.post<ProductSectionSimpleResponse[]>(this.baseUrl+"/product-section-many",data);
  }
  getAllProductSection(){
    return this.http.get(this.baseUrl+"/product-sections");

  }
  deleteProductSection(id: number){
    return this.http.delete(this.baseUrl+"/product-section/"+id);
  }

  updateProductSection(data: any) {
    return this.http.put<ProductSectionResponse>(this.baseUrl + "/product-section", data);

  }
  getSegmentByProductSectionId(id: any) {

    return this.http.get<SegmentResponse[]>(this.baseUrl + "/product-section-segments/" + id);
  }
  getMiniProductSectionsByPlantId(id: number) {
    return this.http.get<StructureMiniResponse[]>(this.baseUrl + "/plant-product-sections-mini/" + id);
  }
  getPsPlantId(id:number) {
    return this.http.get<number>(this.baseUrl + "/plant-product-plant-id/" + id);
  }

  getMiniProductSectionsByNurse() {
    return this.http.get<ProductSectionResponse[]>(this.baseUrl + "/all-nurse");

  }
}
