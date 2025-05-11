import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlantService} from "../../../structures/Services/plant.service";
import {ProductSectionService} from "../../../structures/Services/product-section.service";
import {SegmentService} from "../../../structures/Services/segment.service";
import {LineService} from "../../../structures/Services/line.service";
import {SelectionType} from "../structures-list-selector.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-structures-list-selector-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './structures-list-selector-item.component.html',
  styleUrl: './structures-list-selector-item.component.css'
})
export class StructuresListSelectorItemComponent implements OnInit{

  @Input() selectionType:SelectionType|undefined
  @Output() dataEvent = new EventEmitter<string>();

  @Input() defaultStructureId:any

  defaultPlantId:number=0
  defaultPSId:number=0
  defaultSegmentId:number=0
  defaultLineId:number=0

  selectedPlant:number|undefined
  selectedPS:number|undefined
  selectedSegment:number|undefined
  selectedLine:number|undefined

  plants:{id?:number,name?:string}[]= [{id:1,name:"Sousse"},{id:1,name:"Tunisia"}]
  productSections:{id?:number,name?:string}[]= []
  segments:{id?:number,name?:string}[]= []
  lines:{id?:number,name?:string}[]= []


  constructor(
    private plantService:PlantService,
    private productSectionService:ProductSectionService,
    private segmentService:SegmentService,
    private lineService:LineService
  ) {}

  ngOnInit(): void {
    if(this.defaultStructureId)
      this.autoFillDefaultValues()
    else this.loadPlants()
  }

  loadPlants(){
    this.plantService.getAllPlantsMini().subscribe(
      (data)=>{
        this.plants=data
    })
  }

  loadProductSections(id:number){
    this.productSectionService.getMiniProductSectionsByPlantId(id).subscribe(
      (data)=>{
        this.productSections=data
      },
      ()=>{

      }
    );
  }
  loadSegments(id:number){
    this.segmentService.getMiniSegmentsByProductSectionId(id).subscribe(
      (data)=>{
        this.segments=data
      }
    )
  }
  loadLines(id:number,defaultValue=0){
    this.lineService.getMiniLinesBySegmentId(id).subscribe(
      (data)=>{
        this.lines=data
      }
    )
  }

  selectPlant(value:any){
    this.selectedPlant=value.target.value
    this.selectedPS=0
    this.selectedSegment=0
    this.selectedLine=0
    this.productSectionService.getMiniProductSectionsByPlantId(value.target.value).subscribe(
      (data)=>{
        this.productSections=data
      }
    )
  }
  selectPS(value:any){
    this.selectedPS=value.target.value
    this.selectedSegment=0
    this.selectedLine=0
    this.segmentService.getMiniSegmentsByProductSectionId(value.target.value).subscribe(
      (data)=>{
        this.segments=data
      }
    )
  }
  selectSegment(value:any){
    this.selectedSegment=value.target.value
    this.selectedLine=0
    this.lineService.getMiniLinesBySegmentId(value.target.value).subscribe(
      (data)=>{
        this.lines=data
      }
    )
  }
  selectLine(value:any){
    this.selectedLine=value.target.value
  }

  autoFillPlant(id:number){
    this.plantService.getAllPlantsMini().subscribe(

      (data)=> {
        this.plants = data
        this.selectedPlant=id

      })
  }
  autoFillPS(id:number){
    this.productSectionService.getPsPlantId(id).subscribe(
      (plantId)=>{
        this.plantService.getAllPlantsMini().subscribe(
          (data)=> {
            this.plants = data
            this.selectedPlant = plantId
            this.productSectionService.getMiniProductSectionsByPlantId(plantId).subscribe(
              (data) => {
                this.productSections = data
                this.selectedPS=id
              })
          })
      }
    )
  }
  autoFillSegment(id:number){
    this.segmentService.getSegmentPath(id).subscribe(
      (path)=>{

        this.plantService.getAllPlantsMini().subscribe(
          (data)=> {
            this.plants = data
            this.selectedPlant = path.plantId
            this.productSectionService.getMiniProductSectionsByPlantId(path.plantId).subscribe(
              (data) => {
                this.productSections = data
                this.selectedPS=path.psId
                this.segmentService.getMiniSegmentsByProductSectionId(path.psId).subscribe(
                  (data)=>{
                    this.segments=data
                    this.selectedSegment=id
                  }
                )
              })
          })
      }
    )
  }

  autoFillLine(id:number){
    this.lineService.getLinePath(id).subscribe(
      (path)=>{

        this.plantService.getAllPlantsMini().subscribe(
          (data)=> {

            this.plants = data
            this.selectedPlant = path.plantId
            this.productSectionService.getMiniProductSectionsByPlantId(path.plantId).subscribe(
              (data) => {

                this.productSections = data
                this.selectedPS=path.psId
                this.segmentService.getMiniSegmentsByProductSectionId(path.psId).subscribe(
                  (data)=>{

                    this.segments=data
                    this.selectedSegment=path.segmentId
                    this.lineService.getMiniLinesBySegmentId(path.segmentId).subscribe(
                      (data)=>{

                        this.lines=data
                        this.selectedLine=id
                      }
                    )
                  }
                )
              })
          })
      }
    )
  }

  autoFillDefaultValues(){
    switch (this.selectionType){
      case SelectionType.PLANT:this.autoFillPlant(this.defaultStructureId);break
      case SelectionType.PS:this.autoFillPS(this.defaultStructureId);break
      case SelectionType.SEGMENT:this.autoFillSegment(this.defaultStructureId);break
      case SelectionType.LINE:this.autoFillLine(this.defaultStructureId);break
    }
  }
  protected readonly alert = alert;


}
