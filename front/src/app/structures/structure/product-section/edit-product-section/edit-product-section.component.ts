import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, Validators} from "@angular/forms";
import {ProductSectionService} from "../../../Services/product-section.service";
import {PlantService} from "../../../Services/plant.service";
import {ProductSectionTableService} from "../../../Services/tables-services/product-section-table.service";
import {toProductSectionResponse} from "../../../models/ProductSectionSimpleResponse";
import {Drawer, type DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {PlantResponse} from "../../../models/PlantResponse";
import {ProductSectionResponse} from "../../../models/ProductSectionResponse";

@Component({
  selector: 'app-edit-product-section',
  templateUrl: './edit-product-section.component.html',
  styleUrl: './edit-product-section.component.css'
})
export class EditProductSectionComponent implements OnInit{

  @Output()hideDrawer:EventEmitter<any>=new EventEmitter<any>()
  plantName: any = [];
  drawer: DrawerInterface|null = null
  constructor(

    private toastr:ToastrService,
    private  formBuilder: FormBuilder,
    private productService:ProductSectionService,
    private plantService:PlantService,
    private productSectionTableService:ProductSectionTableService
  ) {
  }

  productSectionId:number|undefined

  formproductSection = this.formBuilder.group({
    plant: ['', Validators.required ],
    productSection: ['',Validators.required]


  });

  findPlant() {
    this.plantService.findAllPlants().subscribe(
      (data) => {
        this.plantName = data;

      },
      (error) => {

      }
    )
  }

  showEditPSDrawer(ps:ProductSectionResponse){
    this.productSectionId=ps.productSectionId
    this.formproductSection.patchValue({
      plant:ps.plantName,
      productSection: ps.name
    })

    this.drawer?.show()
  }
  modifyProductSection() {
    const req={
      plant:this.formproductSection.value.plant,
      productSection:this.formproductSection.value.productSection,
      productSectionId:this.productSectionId,
    }


   if (this.formproductSection.invalid) {
  this.toastr.error("veuillez remplir correctement le formulaire")
} else {
  this.productService.updateProductSection(req).subscribe(
    (res) => {
      this.productSectionTableService.updatePS(res)
      this.hideDrawer.emit()
      this.toastr.success("Product Section mise à jour avec succès")
    },
    (error) => {
      this.toastr.error("impossible de mettre à jour la Product Section")
    }
  )
}

  }



  ngOnInit(): void {
    initFlowbite();
    this.findPlant();

    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-right-edit-productSection');

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

  hided() {
    return (this.formproductSection.value.plant)
  }





}
