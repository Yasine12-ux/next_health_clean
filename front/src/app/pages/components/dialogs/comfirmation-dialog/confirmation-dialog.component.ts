import {Component, EventEmitter, Input, Output} from '@angular/core';

export enum ConfirmationType {
  Delete,
  Deactivate

}
@Component({
  standalone:true,
  selector: 'app-comfirmation-dialog',
  templateUrl: './comfirmation-dialog.component.html',
  styleUrl: './comfirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  @Input()title:string=""
  @Input()message:string=""
  @Input()confirmBtnText:string=""
  @Input()color:string="red"

  type: ConfirmationType =ConfirmationType.Delete

  @Output()confirmClicked :EventEmitter<boolean> = new EventEmitter<boolean>()


  confirm(){
    this.confirmClicked?.emit(true)
  }
  cancel(){
    this.confirmClicked?.emit(false)
  }
  getColor():string{
    switch (this.type) {
      case ConfirmationType.Deactivate:
        return "red"
      case ConfirmationType.Delete:
        return "red"
      default:
        return "red"
    }
  }
}
