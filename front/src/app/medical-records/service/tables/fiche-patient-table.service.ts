import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FichePatientSimpleResponse} from "../../models/FichePatientSimpleResponse";
import {FichePatientResponse} from "../../models/FichePatientResponse";

@Injectable({
  providedIn: 'root'
})
export class FichePatientTableService {
  private _fpBS:any = new BehaviorSubject<FichePatientResponse[]>([]);

  getFichePatientBS():BehaviorSubject<FichePatientResponse[]>{
    return this._fpBS;
  }
  setFichePatientBS(data: FichePatientResponse[]) {
    this._fpBS.next(data);
  }

  addFichePatient(fp:FichePatientResponse){
    const newList=  this._fpBS.getValue()
    newList.push(fp)
    this._fpBS.next(newList)
  }
  modifyFichePatient(fp:FichePatientResponse){
    const updatedFichePatients = this._fpBS.value.map((row:any) => {
      if (row.userId === fp.userId) {
        return fp; // Replace the row with the updated user
      } else {
        return row; // Return unchanged row for other users
      }
    });

    this.setFichePatientBS(updatedFichePatients);
  }
}
