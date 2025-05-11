import {Component, OnInit, ViewChild} from '@angular/core';
import {Drawer, type DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {EditRoleDetailsComponent} from "../roles/edit-role-details/edit-role-details.component";
import {CreateAppointmentComponent} from "./create-appointment/create-appointment.component";

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management.component.html',
  styleUrl: './appointment-management.component.css'
})
export class AppointmentManagementComponent implements OnInit{
  @ViewChild(CreateAppointmentComponent) createAppointmentComponent!:CreateAppointmentComponent;

  drawer: DrawerInterface|null = null

  ngOnInit() {
    initFlowbite()

    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-appointment');

// options with default values
    const options: DrawerOptions = {
      placement: 'left',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
    };
    const instanceOptions: InstanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.drawer = new Drawer($targetEl, options, instanceOptions);


  }

}
