import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AppointmentResponse} from "../../models/AppointmentResponse";
import {BlockOutResponse} from "../../models/BlockOutResponse";

@Injectable({
  providedIn: 'root'
})
export class BlockOutTableService {

  private _blockBS = new BehaviorSubject<BlockOutResponse[]>([]);
  constructor() { }

  getBlockBS():BehaviorSubject<BlockOutResponse[]>{
    return this._blockBS;
  }
  setBlockBS(data: BlockOutResponse[]) {
    this._blockBS.next(data);
  }
  addBlockOut(res:BlockOutResponse){
    const newList =this.getBlockBS().getValue()
    newList.push(res)
    this._blockBS.next(newList)
  }

  updateBlockOut(res: BlockOutResponse) {
    const bos = this._blockBS.value.map(row=>{
      if(row.id==res.id){
        return res;
      }
      return row;
    })
    this.setBlockBS(bos)
  }

  deleteBlockOut(id: number) {
    const bos = this._blockBS.value.filter(row=>row.id!=id)
    this.setBlockBS(bos)
  }
}
