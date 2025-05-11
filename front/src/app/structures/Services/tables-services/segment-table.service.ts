import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SegmentResponse} from "../../models/SegmentResponse";
import {ProductSectionResponse} from "../../models/ProductSectionResponse";

@Injectable({
  providedIn: 'root'
})
export class SegmentTableService {
  private _segmentsBS = new BehaviorSubject<SegmentResponse[]>([]);
  private _plantsNamesList= new BehaviorSubject<string[]>([]) // for filter

  getSegmentsBS():BehaviorSubject<SegmentResponse[]>{
    return this._segmentsBS
  }
  getPlantsNames():BehaviorSubject<string[]>{
    return this._plantsNamesList
  }
  getPSsNamesByPlant(plant:string):string[]{

    const data=this._segmentsBS.getValue().filter(s=>s.plant==plant);
    let ps = data.map(ps=> ps.productSection)
    return [...new Set(ps.map((element) => element)),]
  }

  setSegmentsBS(data: SegmentResponse[]) {
    this._segmentsBS.next(data);

    let pp = data.map(ps=> ps.plant)
    let unique_values_pp = [...new Set(pp.map((element) => element)),];
    this._plantsNamesList.next(unique_values_pp)

  }

  addSegment(data: SegmentResponse) {
    const newList=  this._segmentsBS.getValue()
    newList.push(data)
    this.setSegmentsBS(newList)
  }
  addManySegment(data: SegmentResponse[]) {
    const newList=  this._segmentsBS.getValue()
    for (const s of data) {
      newList.push(s)
    }
    this.setSegmentsBS(newList)
  }

  deleteSegment(id:number){
    this._segmentsBS.forEach(rows => {
      rows.forEach((row, index) => {
        if (row.segmentId === id) {
          rows.splice(index, 1); // Remove the row at the current index
        }
      });
    })
    this.setSegmentsBS(this._segmentsBS.value)
  }
  updateSegment(segment:SegmentResponse) {
    const segments  = this._segmentsBS.value.map(row=>{
      if(row.segmentId==segment.segmentId)
      return segment
      else return row
    })
    this.setSegmentsBS(segments)
  }

  constructor() { }
}
