import {Component, OnInit} from '@angular/core';
import {Drawer, DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";

@Component({
  selector: 'app-create-block-out',
  templateUrl: './create-block-out.component.html',
  styleUrl: './create-block-out.component.css'
})
export class CreateBlockOutComponent implements OnInit{
  drawer: DrawerInterface|null = null

  ngOnInit() {
    initFlowbite()
    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-block-out');

// options with default values
    const options: DrawerOptions = {
      placement: 'left',
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
}
