import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PlantResponse} from "../../models/PlantResponse";
import {PlantSimpleResponse} from "../../models/PlantSimpleResponse";
import {RoleResponse} from "../../../models/roles/role-response";
@Injectable({
  providedIn: 'root'
})
export class PlantTableService {
  private _plantsBS = new BehaviorSubject<PlantResponse[]>([]);

  getPlantsBS():BehaviorSubject<PlantResponse[]>{
    // return this._plantsBS;
    return this._plantsBS
  }

  setPlantsBS(data: PlantResponse[]) {
    this._plantsBS.next(data);
  }
  constructor() {
  }

  addPlant(data: PlantResponse) {
    const newList=  this._plantsBS.getValue()
    newList.push(data)
    this._plantsBS.next(newList)
  }

  deletePlant(id:number){
    this._plantsBS.forEach(rows => {
      rows.forEach((row, index) => {
        if (row.id === id) {
          rows.splice(index, 1); // Remove the row at the current index
        }
      });
    })
    this.setPlantsBS(this._plantsBS.value)
  }

  updatePlant(plant:PlantResponse) {
    const plants  = this._plantsBS.value.map(row=>{
      return (row.id===plant.id)?plant:row
    })
  this.setPlantsBS(plants)
  }

}
