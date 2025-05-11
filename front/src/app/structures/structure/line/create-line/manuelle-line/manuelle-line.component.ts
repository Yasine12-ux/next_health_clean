import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {DrawerInterface, initFlowbite} from "flowbite";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ProductSectionService} from "../../../../Services/product-section.service";
import {PlantService} from "../../../../Services/plant.service";
import {LineService} from "../../../../Services/line.service";
import {SegmentService} from "../../../../Services/segment.service";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {LineTableService} from "../../../../Services/tables-services/line-table.service";
import {toLineResponse} from "../../../../models/LineSimpleResponse";

@Component({
  selector: 'app-manuelle-line',
  templateUrl: './manuelle-line.component.html',
  styleUrl: './manuelle-line.component.css'
})
export class ManuelleLineComponent {
  drawer: DrawerInterface|null = null
  plantName:any =[ ];
  productSectionName:any =[ ];
SegmentName:any =[ ];
  @Output()hideDrawer:EventEmitter<any>=new EventEmitter<any>()
  @ViewChild('plantDropdown') plantDropdown!: ElementRef<HTMLSelectElement>;
  @ViewChild('plantDropdown1') plantDropdown1!: ElementRef<HTMLSelectElement>;
  @ViewChild('plantDropdown2') plantDropdown2!: ElementRef<HTMLSelectElement>;
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

  formLine = this.formBuilder.group({

    line: ['', Validators.required],
    segment: ['',Validators.required],
    plant: ['', Validators.required ],
    productSection: ['', Validators.required ],

  });


  createLines() {
    const selectedPlantId: any = Number(this.formLine.value.plant);
    const selectedPlant = this.plantName.find((plant: any) => plant.id === selectedPlantId);
    this.formLine.value.plant = selectedPlant.name;

    const selectedProductSectionId: any = Number(this.formLine.value.productSection);
    const selectedProductSection = this.productSectionName.find((productSection: any) =>
      productSection.productSectionId === selectedProductSectionId);
    this.formLine.value.productSection = selectedProductSection.name;

    if (this.formLine.invalid) {
      this.toastr.error("please fill the form correctly")
    } else {
      this.lineService.createLine(this.formLine.value).subscribe(
        (data) => {



          this.lineTableService.addLine(toLineResponse(data,true))
            this.formLine.reset({
            plant: '',  // Resetting plant to empty
            productSection: '',  // Resetting product section to empty
            segment: ''  // Resetting segment to empty
          });
          this.hideDrawer.emit()
          this.toastr.success("line created successfully")
        },
        (error) => {
          this.toastr.error("error while creating line")
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
if (this.formLine.value.plant !== null) {

  const selectedPlantId: any = this.formLine.value.plant;


  if (selectedPlantId)
    this.plantService.getProductSectionbyplantId(selectedPlantId).subscribe(
      (data) => {

        this.productSectionName = data;

      },
      (error) => {

      }
    );
}

  }
  findSegment() {
    const selectedProductSectionId: any = this.formLine.value.productSection;
    this.productService.getSegmentByProductSectionId(selectedProductSectionId).subscribe(
      (data) => {

        this.SegmentName = data;

      },
      (error) => {
        console.log(error)
      }
    )
  }





  plantSubscription: Subscription | undefined;
  productSectionSubscription: Subscription | undefined;
  ngOnInit(): void {
    initFlowbite();
    this.findPlant();
    this.findProductSection();
    this.findSegment();

    // set the drawer menu element
    const plantControl = this.formLine.get('plant') as FormControl;
    const productSectionControl = this.formLine.get('productSection') as FormControl;
    // Subscribe to valueChanges observable
    this.plantSubscription = plantControl.valueChanges
      .pipe(
        debounceTime(300), // Debounce the event to avoid too frequent requests
        distinctUntilChanged() // Only trigger when the value actually changes
      )
      .subscribe(() => {

        this.findProductSection();
      });

    this.productSectionSubscription = productSectionControl.valueChanges
      .pipe(
        debounceTime(300), // Debounce the event to avoid too frequent requests
        distinctUntilChanged() // Only trigger when the value actually changes
      )
      .subscribe(() => {
        this.findSegment();
      });
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
