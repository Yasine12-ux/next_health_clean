import {Component} from '@angular/core';
import {Drawer, DrawerInterface, DrawerOptions, initFlowbite, InstanceOptions} from "flowbite";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-create-line',
  templateUrl: './create-line.component.html',
  styleUrl: './create-line.component.css'
})
export class CreateLineComponent {


  drawer: DrawerInterface|null = null


  constructor(

    private toastr:ToastrService,
  ) {
  }
  ngOnInit(): void {
    initFlowbite()
    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-right-line');

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
  downloadTemplate() {

  window.location.href = './../../../../../assets/templates/line.xlsx';
  }


}
