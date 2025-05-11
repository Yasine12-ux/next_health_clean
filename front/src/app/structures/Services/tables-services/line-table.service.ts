import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LineResponse} from "../../models/LineResponse";
import {SegmentResponse} from "../../models/SegmentResponse";

@Injectable({
  providedIn: 'root'
})
export class LineTableService {
  private _linesBS = new BehaviorSubject<LineResponse[]>([]);
  private _plantsNamesList= new BehaviorSubject<string[]>([]) // for filter

  getLinesBS():BehaviorSubject<LineResponse[]>{
    return this._linesBS
  }
  getPlantsNames():BehaviorSubject<string[]>{
    return this._plantsNamesList
  }
  getPSsNamesByPlant(plant:string):string[]{

    const data=this._linesBS.getValue().filter(s=>s.plant==plant);
    let ps = data.map(ps=> ps.productSection)
    return [...new Set(ps.map((element) => element)),]
  }
  getSegmentsNamesByPS(ps:string):string[]{

    const data=this._linesBS.getValue().filter(s=>s.productSection==ps);
    let seg = data.map(seg=> seg.segmentName)
    return [...new Set(seg.map((element) => element)),]
  }
  setLinesBS(data: LineResponse[]) {
    this._linesBS.next(data);
    let x = data.map(ps=> ps.plant)
    let unique_values = [...new Set(x.map((element) => element)),];
    this._plantsNamesList.next(unique_values)
  }

  addLine(data: LineResponse) {
    const newList=  this._linesBS.getValue()
    newList.push(data)
    this._linesBS.next(newList)
  }
  addManyLine(data: LineResponse[]) {
    const newList=  this._linesBS.getValue()
    for(const line of data)
      newList.push(line)
    this._linesBS.next(newList)
  }

  deleteLine(id:number){
    this._linesBS.forEach(rows => {
      rows.forEach((row, index) => {
        if (row.lineId === id) {
          rows.splice(index, 1); // Remove the row at the current index
        }
      });
    })
    this.setLinesBS(this._linesBS.value)
  }

  updateLine(line:LineResponse) {

    const lines  = this._linesBS.value.map(row=>{
      if (row.lineId==line.lineId)
        return line;
      else return row
    })
    this.setLinesBS(lines)
  }
  constructor() { }
}
