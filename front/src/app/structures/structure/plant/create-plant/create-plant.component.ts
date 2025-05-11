import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {initFlowbite} from "flowbite";


import { Drawer } from 'flowbite';
import type { DrawerOptions, DrawerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {PlantService} from "../../../Services/plant.service";
import {PlantTableService} from "../../../Services/tables-services/plant-table.service";
import {toPlantResponse} from "../../../models/PlantSimpleResponse";

@Component({
  selector: 'app-create-plant',
  templateUrl: './create-plant.component.html',
  styleUrl: './create-plant.component.css'
})
export class CreatePlantComponent implements OnInit{
  constructor(

    private toastr:ToastrService,
    private structureService:PlantService,
    private plantTableService:PlantTableService,
    private fb:FormBuilder
  ) {
  }
  plantForm = this.fb.group({
    name: [''],

  });

  drawer: DrawerInterface|null = null



  createPlant(){
    this.structureService.createPlant(this.plantForm.value.name).subscribe(
      data=>{
        this.plantTableService.addPlant(toPlantResponse(data,true))
        this.drawer?.hide()
this.toastr.success("Plant créée")
},
error=>{


    this.toastr.error("Plant existe ")

      }
    )

  }
  ngOnInit(): void {
    // Initialize the drawer
    this.initDrawer();
  }

  initDrawer(): void {
    // set the drawer menu element
    const $targetEl: HTMLElement | null = document.getElementById('drawer-right-plant');
    if (!$targetEl) {
      return;
    }

    // Options for the drawer
    const options = {
      placement: 'right',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
      onHide: () => {
        // Reset form fields when the drawer is hidden
        this.plantForm.reset();
      }
    };

    // Initialize the drawer
    this.drawer = new Drawer($targetEl, options);
  }



  showDrawer(): void {
    this.drawer?.show();
  }

}
