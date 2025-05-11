import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PlantResponse} from "../../models/PlantResponse";
import {ProductSectionResponse} from "../../models/ProductSectionResponse";
import {PlantSimpleResponse} from "../../models/PlantSimpleResponse";
import {ProductSectionSimpleResponse} from "../../models/ProductSectionSimpleResponse";

@Injectable({
  providedIn: 'root'
})
export class ProductSectionTableService {
  private _psBS = new BehaviorSubject<ProductSectionResponse[]>([]);
  private _plantsNamesList= new BehaviorSubject<string[]>([]) // for filter

  getPsBS():BehaviorSubject<ProductSectionResponse[]>{
    return this._psBS
  }
  getPlantsNames():BehaviorSubject<string[]>{
    return this._plantsNamesList
  }
  setPssBS(data: ProductSectionResponse[]) {
    this._psBS.next(data);
    let x = data.map(ps=> ps.plantName)
    let unique_values = [...new Set(x.map((element) => element)),];
    this._plantsNamesList.next(unique_values)
  }
  addPs(data: ProductSectionResponse) {
    const newList=  this._psBS.getValue()
    newList.push(data)
    this.setPssBS(newList)
  }
  addManyPs(data: ProductSectionResponse[]) {
    const newList=  this._psBS.getValue()
    for (const ps of data) {
      newList.push(ps)
    }
    this.setPssBS(newList)
  }
  deleteProductSection(id:number){
    this._psBS.forEach(rows => {
      rows.forEach((row, index) => {
        if (row.productSectionId === id) {
          rows.splice(index, 1); // Remove the row at the current index
        }
      });
    })
    this.setPssBS(this._psBS.value)
  }

  updatePS(ps:ProductSectionResponse) {
    const pss  = this._psBS.value.map(row=>{
      return (row.productSectionId===ps.productSectionId)?ps:row
    })
    this.setPssBS(pss)
  }

  constructor() { }
}
