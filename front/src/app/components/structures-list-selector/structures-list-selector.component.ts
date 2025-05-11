import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PlantService} from "../../structures/Services/plant.service";
import {ProductSectionService} from "../../structures/Services/product-section.service";
import {SegmentService} from "../../structures/Services/segment.service";
import {LineService} from "../../structures/Services/line.service";
import {
  StructuresListSelectorItemComponent
} from "./structures-list-selector-item/structures-list-selector-item.component";
import {ToastrService} from "ngx-toastr";

export enum SelectionType {
  PLANT=0,
  PS=1,
  SEGMENT=2,
  LINE=3
}

@Component({
  selector: 'app-structures-list-selector',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    StructuresListSelectorItemComponent
  ],
  templateUrl: './structures-list-selector.component.html',
  styleUrl: './structures-list-selector.component.css'
})
export class StructuresListSelectorComponent implements OnInit{
  @ViewChildren(StructuresListSelectorItemComponent) children!: QueryList<StructuresListSelectorItemComponent>;

  @Input() selectionType:number|undefined
  @Input() title:string|undefined
  @Input() structureType:string|undefined
  @Input() disabledAddDeleteButtons:boolean|undefined
  @Input() defaultValues:(number|undefined)[]|undefined=[]

  form = this.fb.group({
    structures: this.fb.array([])
  });

  constructor(
      private fb:FormBuilder,
      private plantService:PlantService,
      private productSectionService:ProductSectionService,
      private segmentService:SegmentService,
      private lineService:LineService,
      private toastrService:ToastrService
              ) {

  }

  ngOnInit(): void {
      if(this.defaultValues)
        this.fillDefaultValues()
      if(this.defaultValues?.length==0)
        this.addStructure()

  }




  get structures() {
    return this.form.controls["structures"] as FormArray;
  }


  loadProductSections(id:number){
    this.productSectionService.getMiniProductSectionsByPlantId(id).subscribe({
      next(data){
      }
    })
  }
  loadSegments(id:number){
    this.segmentService.getMiniSegmentsByProductSectionId(id).subscribe({
      next(data){
      }
    })
  }
  loadLines(id:number){
    this.lineService.getMiniLinesBySegmentId(id).subscribe({
      next(data){
      }
    })
  }

  fillDefaultValues(){
    if(!this.defaultValues) return
    for (const defaultValue of this.defaultValues) {
      this.addStructure()
    }
  }
  addStructure() {
    const structureForm = this.fb.group({
      plant: ['plant', Validators.required],
      ps: ['product section', Validators.required],
      segment: ['segment', Validators.required],
      line: ['line', Validators.required],
    });
    this.structures.push(structureForm);
  }
  addStructureWithValues(plant:string="plant",ps:string="ps",segment:string="segment",line:string="line") {
    const structureForm = this.fb.group({
      plant: [plant, Validators.required],
      ps: [ps, Validators.required],
      segment: [segment, Validators.required],
      line: [line, Validators.required],
    });
    this.structures.push(structureForm);
  }
  deleteStructure(lessonIndex: number) {
    if(this.structures.length>1) {
      this.structures.removeAt(lessonIndex);
    }
    else
      this.toastrService.info("Minimun 1 structure")
  }

  getSelectedPlantsIds(){
    let selectedPlantsIds:(number)[]=[]
    for (const child of this.children) {
      selectedPlantsIds.push(Number(child.selectedPlant))
    }
    return selectedPlantsIds
  }

  getSelectedPSsIds(){
    let selectedPSsIds:(number)[]=[]
    for (const child of this.children) {
      selectedPSsIds.push(Number(child.selectedPS))
    }
    return selectedPSsIds
  }
  getSelectedSegmentsIds(){
    let selectedSegmentsIds:(number)[]=[]
    for (const child of this.children) {
      selectedSegmentsIds.push(Number(child.selectedSegment))
    }
    return selectedSegmentsIds
  }
  getSelectedLinesIds(){
    let selectedLinesIds:(number)[]=[]
    for (const child of this.children) {
      selectedLinesIds.push(Number(child.selectedLine))
    }
    return selectedLinesIds
  }


  protected readonly alert = alert;
  protected readonly SelectionType = SelectionType;
}
