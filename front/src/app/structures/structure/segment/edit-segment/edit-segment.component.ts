import {Component, OnInit} from '@angular/core';
import {Drawer, DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {PlantService} from "../../../Services/plant.service";
import {ProductSectionService} from "../../../Services/product-section.service";
import {SegmentService} from "../../../Services/segment.service";
import {SegmentTableService} from "../../../Services/tables-services/segment-table.service";
import {SegmentSimpleResponse, toSegmentResponse} from "../../../models/SegmentSimpleResponse";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {ProductSectionResponse} from "../../../models/ProductSectionResponse";
import {SegmentResponse} from "../../../models/SegmentResponse";
import {PlantResponse} from "../../../models/PlantResponse";

@Component({
  selector: 'app-edit-segment',
  templateUrl: './edit-segment.component.html',
  styleUrl: './edit-segment.component.css'
})
export class EditSegmentComponent implements OnInit{

  drawer: DrawerInterface|null = null

  plantName:PlantResponse[] =[];
  productSectionName :ProductSectionResponse[] =[];

  segmentId:number|undefined

  constructor(

    private toastr:ToastrService,
    private  formBuilder: FormBuilder,
    private plantService:PlantService,
    private productService:ProductSectionService,
    private segmentService:SegmentService,
    private segmentTableService:SegmentTableService
  ) {
  }

  formSegment = {
    plant: '',
    productSection: '',
    segment:''

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
    const selectedPlantId: any = this.formSegment.plant;

    if (selectedPlantId)
      this.plantService.getProductSectionbyplantId(selectedPlantId).subscribe(
        (data) => {
          this.productSectionName = data;
        },
        (error) => {
        }
      );
  }
  findProductSectionWithSelection(ps:string) {

    const selectedPlantId: any = this.formSegment.plant;

    if (selectedPlantId)
      this.plantService.getProductSectionbyplantId(selectedPlantId).subscribe(
        (data) => {
          this.productSectionName = data;

          this.formSegment.productSection=ps
        },
        (error) => {
        }
      );
  }


  plantSubscription: Subscription | undefined;
  ngOnInit(): void {
    initFlowbite();
    this.findPlant();

    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-right-edit-segment');

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
        this.formSegment = {
          plant: '',
          productSection: '',
          segment:''
        };
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


  showEditSegmentDrawer(segment:SegmentResponse){
    this.segmentId=segment.segmentId
    let selectedPlant :any;
    this.plantName.forEach(
      row=>{
        if(row.name==segment.plant)
          selectedPlant=row.id?.toString()
      }
    )
    this.formSegment.plant=selectedPlant
    this.findProductSectionWithSelection(segment.productSection)
    this.formSegment.segment=segment.segmentName

    this.drawer?.show()
  }
  modifySegment() {
    let selectedPlantName:string|undefined
    this.plantName.forEach(
      row=>{
        if (row.id?.toString()==this.formSegment.plant)
          selectedPlantName=row.name;
      }
    )
 if ( !this.formSegment.plant ||!this.formSegment.productSection || !this.formSegment.segment || !this.segmentId || !selectedPlantName) {
  this.toastr.error("veuillez remplir correctement le formulaire")
} else {


  const req:SegmentSimpleResponse={
    plant:selectedPlantName,
    productSection:this.formSegment.productSection,
    segmentName:this.formSegment.segment,
    segmentId:this.segmentId
  }
  this.segmentService.updateSegment(req).subscribe(
    (res) => {
      this.toastr.success("segment mis à jour avec succès")
      this.segmentTableService.updateSegment(res)

      this.drawer?.hide()
    },
    (error) => {
      this.toastr.error("impossible de créer le segment")
    }
  )


    }

  }


// Don't forget to unsubscribe in ngOnDestroy
  ngOnDestroy() {
    if (this.plantSubscription) {
      this.plantSubscription.unsubscribe();
    }


  }


}
