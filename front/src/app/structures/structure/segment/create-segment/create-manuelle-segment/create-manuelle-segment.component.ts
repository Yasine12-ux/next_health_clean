import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {DrawerInterface, initFlowbite} from "flowbite";
import {ToastrService} from "ngx-toastr";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  Validators,
  ɵElement,
  ɵValue
} from "@angular/forms";
import {SegmentService} from "../../../../Services/segment.service";
import {ProductSectionService} from "../../../../Services/product-section.service";
import {PlantService} from "../../../../Services/plant.service";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {SegmentTableService} from "../../../../Services/tables-services/segment-table.service";
import {toSegmentResponse} from "../../../../models/SegmentSimpleResponse";

@Component({
  selector: 'app-create-manuelle-segment',
  templateUrl: './create-manuelle-segment.component.html',
  styleUrl: './create-manuelle-segment.component.css'
})
export class CreateManuelleSegmentComponent {
  @Output()hideDrawer:EventEmitter<any>=new EventEmitter<any>()
  plantName:any =[];
  productSectionName :any =[];
  @ViewChild('plantDropdown') plantDropdown!: ElementRef<HTMLSelectElement>;
  @ViewChild('plantDropdown1') plantDropdown1!: ElementRef<HTMLSelectElement>;
  constructor(

    private toastr:ToastrService,
    private  formBuilder: FormBuilder,
    private plantService:PlantService,
    private productService:ProductSectionService,
    private segmentService:SegmentService,
    private segmentTableService:SegmentTableService
  ) {
  }

  formSegment = this.formBuilder.group({
    plant: ['', Validators.required ],
    productSection: ['', Validators.required ],
    segment: ['',Validators.required]



  });


  createSegment() {
    const selectedPlantId: any = Number(this.formSegment.value.plant);
    const selectedPlant = this.plantName.find((plant: any) => plant.id === selectedPlantId);
this.formSegment.value.plant = selectedPlant.name;
      if (this.formSegment.invalid) {
  this.toastr.error("veuillez remplir correctement le formulaire")
      } else {
        this.segmentService.createSegment(this.formSegment.value).subscribe(
          (res) => {
            this.segmentTableService.addSegment(toSegmentResponse(res,true))
            this.formSegment.reset({
              plant: '',  // Resetting plant to empty
              productSection: '',  // Resetting product section to empty
              segment: ''  // Resetting segment to empty
            });

            this.hideDrawer.emit()
this.toastr.success("segment créé avec succès")
},
(error) => {
          }
        )
      }

  }

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


    const selectedPlantId: any = this.formSegment.value.plant;




if (selectedPlantId)
      this.plantService.getProductSectionbyplantId(selectedPlantId).subscribe(
        (data) => {

          this.productSectionName = data;


        },
        (error) => {
        }
      );


  }


  plantSubscription: Subscription | undefined;
  ngOnInit(): void {
    initFlowbite();
    this.findPlant();
    this.findProductSection();
    // set the drawer menu element
    const plantControl = this.formSegment.get('plant') as FormControl;

    // Subscribe to valueChanges observable
    this.plantSubscription = plantControl.valueChanges
      .pipe(
        debounceTime(300), // Debounce the event to avoid too frequent requests
        distinctUntilChanged() // Only trigger when the value actually changes
      )
      .subscribe(() => {
        this.findProductSection();
      });
  }

// Don't forget to unsubscribe in ngOnDestroy
  ngOnDestroy() {
    if (this.plantSubscription) {
      this.plantSubscription.unsubscribe();
    }


  }


}
