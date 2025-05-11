import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Drawer, DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";

import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductSectionService} from "../../../../Services/product-section.service";
import {PlantService} from "../../../../Services/plant.service";
import {ProductSectionTableService} from "../../../../Services/tables-services/product-section-table.service";
import {toProductSectionResponse} from "../../../../models/ProductSectionSimpleResponse";

@Component({
  selector: 'app-create-manuelle-product-section',
  templateUrl: './create-manuelle-product-section.component.html',
  styleUrl: './create-manuelle-product-section.component.css'
})
export class CreateManuelleProductSectionComponent implements OnInit {
  @ViewChild('plantDropdown') plantDropdown!: ElementRef<HTMLSelectElement>;

  @Output() hideDrawer: EventEmitter<any> = new EventEmitter<any>();
  drawer: Drawer | null = null;
  plantName: any = [];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private productService: ProductSectionService,
    private plantService: PlantService,
    private productSectionTableService: ProductSectionTableService
  ) {}

  formproductSection!: FormGroup;
  ngOnInit(): void {
    this.initForm();
    initFlowbite();
    this.findPlant();



  }

  initForm(): void {
    this.formproductSection = this.formBuilder.group({
      plant: ['', Validators.required],
      productSection: ['', Validators.required]
    });
  }

  findPlant(): void {
    this.plantService.findAllPlants().subscribe(
      (data) => {
        this.plantName = data;
      },
      (error) => {

      }
    );
  }

 createProductSection(): void {
  if (this.formproductSection.invalid) {
    this.toastr.error('Veuillez remplir correctement le formulaire');
  } else {
    this.productService.createProduct(this.formproductSection.value).subscribe(
      (res) => {
        this.productSectionTableService.addPs(toProductSectionResponse(res,true))
        this.formproductSection.reset();

        this.hideDrawer.emit();

        this.plantDropdown.nativeElement.value = '';
        this.toastr.success('product section créée avec succès');

      },
      (error) => {
      }
    );
  }
}

  hided(): boolean {
    return !!this.formproductSection.value.plant;
  }
}
