import {Component, OnInit} from '@angular/core';
import {Drawer, initFlowbite} from 'flowbite';
import type { DrawerOptions, DrawerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-create-segment',
  templateUrl: './create-segment.component.html',
  styleUrl: './create-segment.component.css'
})
export class CreateSegmentComponent implements OnInit{






  drawer: DrawerInterface|null = null


  constructor(

    private toastr:ToastrService,
  ) {
  }

  downloadTemplate() {

    window.location.href = './../../../../../assets/templates/segment.xlsx';
  }
  ngOnInit(): void {
    initFlowbite()
    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-right-segment');

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





  showDrawer(){
    this.drawer?.show()
  }




}
