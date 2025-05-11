import { Component,OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {RegisterRequest} from "../../models/register-request";
import {AuthService} from "../../services/auth-services/auth.service";

import { Drawer } from 'flowbite';
import type { DrawerOptions, DrawerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import {ToastrService} from "ngx-toastr";

import {RolesService} from "../../services/roles.service";
import {Permission} from "../../models/roles/permission";

import {RoleRequest} from "../../models/roles/RoleRequest";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RolesTableService} from "../services/roles-table.service";
@Component({
  selector: 'app-create-role-details',
  templateUrl: './create-role-details.component.html',
  styleUrl: './create-role-details.component.css'
})
export class CreateRoleDetailsComponent implements OnInit{
  form: FormGroup | undefined;

  roles_name:string[]=[]
  drawer: DrawerInterface|null = null

  constructor(
    private authService:AuthService,
    private rolesService:RolesService,
    private rolesTableService:RolesTableService,
    private toastr:ToastrService,
    private formBuilder: FormBuilder
    ) {
  }

  permissionsDetails:Permission[]=[]


    ngOnInit(): void {
      initFlowbite()
      this.form = this.formBuilder.group({
        checkboxes: this.formBuilder.array([]),
        name:['',[Validators.minLength(1),Validators.required]],
        description:['',]
      });
      // set the drawer menu element
      const $targetEl: HTMLElement|null = document.getElementById('create-role-drawer');
      this.initRoles()

// options with default values
      const options: DrawerOptions = {
        placement: 'right',
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

  initRoles(){
    this.rolesService.getAllPermissions().subscribe({
      next:(res)=>{
        this.permissionsDetails=res
        res.filter(p=>p.name).forEach(p=>this.addCheckbox())


    }
    })

    this.rolesService.getAllRolesNames()
      .subscribe({
        next: (response) => {
          this.roles_name = response
        }
      });
  }

  showDrawer(){
    this.drawer?.show()
  }

  isRoleUsed(name:string):boolean{
    return this.roles_name.includes(name)
  }

  // permissions check boxes

  get checkboxesFormArray() {
    return this.form?.controls["checkboxes"] as FormArray;
  }

  addCheckbox() {
    this.checkboxesFormArray.push(this.formBuilder.control(false));
  }

  CreateRole() {
    let permissionsIds:number[]=[]
    for (let i = 0; i < this.permissionsDetails.length; i++) {
      if(this.checkboxesFormArray.value.at(i)){
        let x = this.permissionsDetails.at(i)?.id
        if(x)permissionsIds.push(x)
      }
    }


    this.form?.value.name
    let roleReq:RoleRequest={
      name:this.form?.value.name,
      description:this.form?.value.description,
      rolePermissionsIds:permissionsIds
    }
    this.rolesService.createRole(roleReq).subscribe({
      next:(res)=>{
        res.createdNow=true
        this.rolesTableService.addRole(res)
        this.form?.reset()
        this.drawer?.hide()
        this.toastr.success("créé")
      },
      error:()=>{
      }
    })
  }
}
