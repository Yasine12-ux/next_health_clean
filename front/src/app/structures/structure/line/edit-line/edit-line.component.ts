import {Component, EventEmitter, Output} from '@angular/core';
import {Drawer, DrawerInterface, DrawerOptions, initFlowbite, InstanceOptions} from "flowbite";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ProductSectionService} from "../../../Services/product-section.service";
import {PlantService} from "../../../Services/plant.service";
import {SegmentService} from "../../../Services/segment.service";
import {LineService} from "../../../Services/line.service";
import {LineTableService} from "../../../Services/tables-services/line-table.service";
import {LineSimpleResponse, toLineResponse} from "../../../models/LineSimpleResponse";
import {debounceTime, distinctUntilChanged, flatMap, mergeMap, Subscription} from "rxjs";
import {SegmentResponse} from "../../../models/SegmentResponse";
import {LineResponse} from "../../../models/LineResponse";
import {PlantResponse} from "../../../models/PlantResponse";
import {ProductSectionResponse} from "../../../models/ProductSectionResponse";
import {SegmentSimpleResponse} from "../../../models/SegmentSimpleResponse";

@Component({
  selector: 'app-edit-line',
  templateUrl: './edit-line.component.html',
  styleUrl: './edit-line.component.css'
})
export class EditLineComponent{

  drawer: DrawerInterface|null = null
  plantName:PlantResponse[] =[]
  productSectionName:ProductSectionResponse[] =[];
  SegmentName:SegmentResponse[] =[ ];

  lineId:number|undefined

constructor(
  private toastr: ToastrService,
  private formBuilder: FormBuilder,
  private productService: ProductSectionService,
  private plantService: PlantService,
  private segmentService: SegmentService,
  private lineService: LineService,
  private lineTableService: LineTableService
) {


}

formLine ={

  line:'',
  segment:'',
  plant: '',
  productSection: '',

};



findPlant() {
  this.plantService.findAllPlants().subscribe(
    (data) => {
      this.plantName = data;

    },
    (error) => {

    }
  )
}
findProductSection() {
  const selectedPlantId: any = this.formLine.plant; // Convert to number

  if (selectedPlantId)
    this.plantService.getProductSectionbyplantId(selectedPlantId).subscribe(
      (data) => {

        this.productSectionName = data;

      },
      (error) => {

      }
    );
}

applyValues(ps:string,segment:string){
  const selectedPlantId: any = this.formLine.plant;
  this.plantService.getProductSectionbyplantId(selectedPlantId).pipe(
    mergeMap(
      data => {
        this.productSectionName=data
        data.map(row=>{
          if(row.name==ps){
            this.formLine.productSection=row.productSectionId.toString()
          }
        })
        return this.productService.getSegmentByProductSectionId(this.formLine.productSection)
      })
  ).subscribe(data=>{
    this.SegmentName=data
    this.formLine.segment=segment

  })
}


  findSegment() {
  const selectedProductSectionId: any = this.formLine.productSection;
  this.productService.getSegmentByProductSectionId(selectedProductSectionId).subscribe(
    (data) => {
      this.SegmentName = data;
    },
    (error) => {

    }
  )
}





plantSubscription: Subscription | undefined;
productSectionSubscription: Subscription | undefined;
ngOnInit(): void {
  initFlowbite();
  this.findPlant();


  const $targetEl: HTMLElement|null = document.getElementById('drawer-right-edit-line');

// options with default values
  const options: DrawerOptions = {
    placement: 'right',
    backdrop: true,
    bodyScrolling: false,
    edge: false,
    edgeOffset: '',
    backdropClasses:
      'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
    onHide: () => {

    },
    onShow: () => {

    },
    onToggle: () => {

    },
  };
  const instanceOptions: InstanceOptions = {
    id: 'drawer-js-example',
    override: true
  };
  this.drawer = new Drawer($targetEl, options, instanceOptions);


}


  showEditSegmentDrawer(line:LineResponse) {

    this.lineId = line.lineId
    let selectedPlant: any;
    this.plantName.forEach(
      row => {
        if (row.name == line.plant)
          selectedPlant = row.id?.toString()
      }
    )


      this.formLine.plant = selectedPlant
      this.applyValues(line.productSection,line.segmentName)
      this.formLine.line = line.lineName
      this.drawer?.show()
    }



  modifyLine() {
    let selectedPlantName:string|undefined
    this.plantName.forEach(
      row=>{
        if (row.id?.toString()==this.formLine.plant)
          selectedPlantName=row.name;
      }
    )
    let selectedPSName:string|undefined
    this.productSectionName.forEach(
      row=>{
        if (row.productSectionId?.toString()==this.formLine.productSection)
          selectedPSName=row.name;
      }
    )
    if ( !this.formLine.plant ||!this.formLine.productSection || !this.formLine.segment || !this.lineId || !selectedPlantName ||!selectedPSName) {
this.toastr.error("veuillez remplir correctement le formulaire")
   } else {

      const req: LineSimpleResponse = {
        plant: selectedPlantName,
        productSection: selectedPSName,
        segment: this.formLine.segment,
        lineId: this.lineId,
        line:this.formLine.line
      }

      this.lineService.updateLine(req).subscribe(
        (data) => {


          this.lineTableService.updateLine(data)
         this.toastr.success("line créée avec succès")
          this.drawer?.hide()
        },
        (error) => {
        }
      )
    }


  }


ngOnDestroy() {
  if (this.plantSubscription) {
    this.plantSubscription.unsubscribe();
  }
  if (this.productSectionSubscription) {
    this.productSectionSubscription.unsubscribe();
  }

}
}
