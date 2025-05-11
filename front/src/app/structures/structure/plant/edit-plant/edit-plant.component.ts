import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {PlantService} from "../../../Services/plant.service";
import {PlantTableService} from "../../../Services/tables-services/plant-table.service";
import {FormBuilder} from "@angular/forms";
import {Drawer, DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {PlantResponse} from "../../../models/PlantResponse";
import {copyUserResponse} from "../../../../models/user-response";

@Component({
  selector: 'app-edit-plant',
  templateUrl: './edit-plant.component.html',
  styleUrl: './edit-plant.component.css'
})
export class EditPlantComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private structureService: PlantService,
    private plantTableService: PlantTableService,
    private fb: FormBuilder
  ) {
  }

  plantId:number|undefined

  plantForm = this.fb.group({
    name: [''],

  });

  drawer: DrawerInterface | null = null




  ngOnInit(): void {
    initFlowbite()

    // set the drawer menu element
    const $targetEl: HTMLElement | null = document.getElementById('drawer-right-edit-plant');

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

  showEditPlantDrawer(plant:PlantResponse){
    this.plantId=plant.id
    this.plantForm.patchValue({
      name:plant.name
    })
    this.drawer?.show()
  }
  modifyPlant(){
    const req={id:this.plantId,name:this.plantForm.value.name?.toString()}
    this.structureService.updatePlant(req).subscribe(
      (data) => {

        this.plantTableService.updatePlant(data)
        this.drawer?.hide()
  this.toastr.success("Plant mise à jour")
},
error => {

    this.toastr.error("peut-être que le nom est utilisé","Non mis à jour")
      }
    )

  }

  showDrawer() {
    this.drawer?.show()
  }
}
