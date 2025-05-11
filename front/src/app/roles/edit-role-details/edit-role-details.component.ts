import { Component,OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {RegisterRequest} from "../../models/register-request";
import {AuthService} from "../../services/auth-services/auth.service";

import { Drawer } from 'flowbite';
import type { DrawerOptions, DrawerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import {ToastrService} from "ngx-toastr";
import {UserResponse} from "../../models/user-response";
import {RolesService} from "../../services/roles.service";
import {Permission} from "../../models/roles/permission";
import {RoleResponse} from "../../models/roles/role-response";
import {RoleRequest} from "../../models/roles/RoleRequest";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RolesTableService} from "../services/roles-table.service";
@Component({
  selector: 'edit-role-details',
  templateUrl: './edit-role-details.component.html',
  styleUrl: './edit-role-details.component.css'
})
export class EditRoleDetailsComponent implements OnInit{
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

  roleToModify:RoleResponse={}
  canEdit:boolean=true

    ngOnInit(): void {
      initFlowbite()
      this.form = this.formBuilder.group({
        checkboxes: this.formBuilder.array([]),
        name:["",[Validators.minLength(1),Validators.required]],
        description:["",this.roleToModify.description,]
      });
      // set the drawer menu element
      const $targetEl: HTMLElement|null = document.getElementById('edit-role-drawer');
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

  showDrawer(role:RoleResponse){
    this.roleToModify=role

    this.form?.patchValue({
      name: role.name || '',
      description: role.description || '',
    });

    for (let i = 0; i < this.checkboxesFormArray.length; i++) {
      const state=role.rolePermissionsIds?.includes(i+1)

      this.checkboxesFormArray.at(i).patchValue(state)
    }
    // this.checkboxesFormArray.at(1).patchValue(this.formBuilder.control(false))


    this.drawer?.show()
  }

  isRoleUsed(name:string):boolean{
    if(name==this.roleToModify.name) return false
    return this.roles_name.includes(name)
  }

  // permissions check boxes

  get checkboxesFormArray() {
    return this.form?.controls["checkboxes"] as FormArray;
  }

  addCheckbox() {
    this.checkboxesFormArray.push(this.formBuilder.control(false));
  }

  SaveRole() {

    let permissionsIds:number[]=[]
    for (let i = 0; i < this.permissionsDetails.length; i++) {

      if(this.checkboxesFormArray.value.at(i)){
        let x = this.permissionsDetails.at(i)?.id
        if(x)permissionsIds.push(x)
      }
    }
    this.roleToModify={
      id:this.roleToModify.id,
      name:this.form?.value.name,
      description:this.form?.value.description,
      rolePermissionsIds:permissionsIds
    }

    this.rolesService.modifyRole(this.roleToModify).subscribe({
      next:(res)=>{
        this.rolesTableService.modifyRole(res)
        this.form?.reset()
        this.drawer?.hide()
this.toastr.success("Modifié")
}
    })
  }
}
