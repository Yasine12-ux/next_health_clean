import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LineSimpleResponse} from "../models/LineSimpleResponse";
import {LineResponse} from "../models/LineResponse";
import {StructureMiniResponse} from "../models/StructureMiniResponse";
import {UserStructureResponse} from "../models/UserStructureResponse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LineService {
  baseUrl = environment.apiUrlStructures+'/lines';
  constructor(private http :HttpClient) { }

  createLine(data: any){
    return this.http.post<LineSimpleResponse>(this.baseUrl+"/line",data);
  }
  createManyLine(data: any){
    return this.http.post<LineSimpleResponse[]>(this.baseUrl+"/line-many",data);
  }
  getAllLine(){
    return this.http.get(this.baseUrl+"/lines");

  }
  deleteLine(id: any){
    return this.http.delete(this.baseUrl+"/line/"+id);
  }

  updateLine(data: LineSimpleResponse) {
    return this.http.put<LineResponse>(this.baseUrl + "/line", data);
  }
  getMiniLinesBySegmentId(id: number) {
    return this.http.get<StructureMiniResponse[]>(this.baseUrl + "/lines-mini/" + id);
  }
  getLinePath(id:number) {
    return this.http.get<{plantId:number,psId:number,segmentId:number}>(this.baseUrl + "/line-path/" + id);
  }

  getLineWorkers(id:number){
    return this.http.get<UserStructureResponse[]>(this.baseUrl + `/line-workers/${id}`);
  }
}
