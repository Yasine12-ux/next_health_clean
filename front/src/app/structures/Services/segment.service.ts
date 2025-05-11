  import { Injectable } from '@angular/core';
  import {HttpClient} from "@angular/common/http";
  import {SegmentSimpleResponse} from "../models/SegmentSimpleResponse";
  import {SegmentResponse} from "../models/SegmentResponse";
  import {StructureMiniResponse} from "../models/StructureMiniResponse";
  import {environment} from "../../../environments/environment";

  @Injectable({
    providedIn: 'root'
  })
  export class SegmentService {
    baseUrl = environment.apiUrlStructures+'/segments';

    constructor(private http: HttpClient) {
    }


    createSegment(data: any) {
      return this.http.post<SegmentSimpleResponse>(this.baseUrl + "/segment", data);
    }

    createManySegment(data: any) {
      return this.http.post<SegmentSimpleResponse[]>(this.baseUrl + "/segment-many", data);
    }

    getAllSegment() {
      return this.http.get(this.baseUrl + "/all-segments");

    }
    getSegmentById(id: any) {
      return this.http.get(this.baseUrl + "/segment/" + id);
    }
    deleteSegment(id: number) {
      return this.http.delete(this.baseUrl + "/segment/" + id);
    }

    updateSegment(data: SegmentSimpleResponse) {
      return this.http.put<SegmentResponse>(this.baseUrl + "/segment", data);
    }

    getMiniSegmentsByProductSectionId(id: number) {
      return this.http.get<StructureMiniResponse[]>(this.baseUrl + "/product-section-segments-mini/" + id);
    }
    getSegmentPath(id:number) {
      return this.http.get<{plantId:number,psId:number}>(this.baseUrl + "/segment-path/" + id);
    }

  }
