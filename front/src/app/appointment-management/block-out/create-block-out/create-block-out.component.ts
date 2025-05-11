import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlockOutTableService} from "../../services/tables/block-out-table.service";
import {BlockOutService} from "../../services/block-out.service";
import {BlockOutRequest} from "../../models/BlockOutRequest";
import {Drawer, DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {BlockOutResponse} from "../../models/BlockOutResponse";
import {defaults} from "autoprefixer";

@Component({
  selector: 'app-create-block-out',
  templateUrl: './create-block-out.component.html',
  styleUrl: './create-block-out.component.css'
})
export class CreateBlockOutComponent implements OnInit{
  toEdit:BlockOutResponse|undefined
  @Input() drawer:DrawerInterface|null = null

  startDate:string=""
  endDate:string=""

  daysPeriod:number=0

  startTime =""
  endTime=""

  timePeriod:number=0
  errorDate: boolean=false;
  errorTime: boolean=false;

  constructor(
    private blockOutTableService:BlockOutTableService,
    private blockOutService:BlockOutService
  ) {
  }


  ngOnInit() {
    initFlowbite()
    this.setNextWeek()
    this.setTheDay()
  }

  calculateDifferenceDate() {
    const date1 = new Date(this.startDate);
    const date2 = new Date(this.endDate);

    // Calculate the difference in milliseconds
    const differenceMs = date2.getTime() - date1.getTime();
    if(differenceMs<0){
      this.errorDate=true
    }else{
      this.errorDate=false
      if(!Number.isNaN(differenceMs))
        this.daysPeriod = Math.ceil(differenceMs / (1000 * 60 * 60 * 24))+1;
    }
  }
  private calculateDifferenceTime() {

    const [hours1, minutes1, seconds1] = this.startTime.split(':').map(Number);
    const [hours2, minutes2, seconds2] = this.endTime.split(':').map(Number);

    // Calculate the difference in hours
    const diff = hours2 - hours1;
    if(diff<0){
      this.errorTime=true
    }else{
      this.errorTime=false
      this.timePeriod=diff
    }
  }

  dateChanged(value:any){
    this.calculateDifferenceDate()
  }

  timeChanged(value:any){
    this.calculateDifferenceTime()
  }

  setTheDay(){
    this.startTime="08:00:00"
    this.endTime="17:00:00"
    this.calculateDifferenceTime()
  }


  setNextWeek() {
    const today = new Date();

// Calculate the first day of next week
    const nextWeekFirstDay = new Date(today);
    nextWeekFirstDay.setDate(today.getDate() + (7 - today.getDay()) + 1);

// Calculate the last day of next week
    const nextWeekLastDay = new Date(nextWeekFirstDay);
    nextWeekLastDay.setDate(nextWeekFirstDay.getDate() + 6);


    this.startDate= nextWeekFirstDay.toISOString().slice(0, 10);
    this.endDate = nextWeekLastDay.toISOString().slice(0, 10);

    this.calculateDifferenceDate()
  }
  save(){
    const blockOutRequest:BlockOutRequest={
      startDate:this.startDate,
      endDate:this.endDate,
      startTime:this.startTime,
      endTime:this.endTime
    }
    this.blockOutService.create(blockOutRequest).subscribe(
      (data)=>{
        this.blockOutTableService.addBlockOut(data)
        this.drawer?.hide()
      }
    )
  }

  update(){
    if(!this.toEdit)return
    const blockOutResponce:BlockOutResponse={
      id:this.toEdit.id,
      plantId:this.toEdit.plantId,
      startDate:this.startDate,
      endDate:this.endDate,
      startTime:this.startTime,
      endTime:this.endTime
    }
    this.blockOutService.update(blockOutResponce).subscribe(
      (data)=>{
        this.blockOutTableService.updateBlockOut(data)
        this.drawer?.hide()
      }
    )
  }
  delete(){
    if(!this.toEdit)return
    const id= this.toEdit.id
    this.blockOutService.delete(this.toEdit.id).subscribe(
      ()=>{

        this.blockOutTableService.deleteBlockOut(id)
        this.drawer?.hide()
      }
    )
  }

  fillDefault(){
    if(!this.toEdit) {
      this.startDate=""
      this.endDate=""
      this.startTime=""
      this.endTime=""
      return
    }

    if(this.toEdit?.startDate)this.startDate=this.toEdit.startDate
    if(this.toEdit?.endDate)this.endDate=this.toEdit.endDate;
    if(this.toEdit?.startTime)this.startTime=this.toEdit.startTime;
    if(this.toEdit?.endTime)this.endTime=this.toEdit.endTime;
  }

  protected readonly defaults = defaults;
}
