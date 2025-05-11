import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {initFlowbite} from "flowbite";
import {RegisterRequest} from "../../models/register-request";
import {AuthService} from "../../services/auth-services/auth.service";

import { Drawer } from 'flowbite';
import type { DrawerOptions, DrawerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import {ToastrService} from "ngx-toastr";
import {UserTableService} from "../service/user-table.service";
import {copyUserResponse, UserResponse} from "../../models/user-response";
import {RolesService} from "../../services/roles.service";
import {
  SelectionType,
  StructuresListSelectorComponent
} from "../../components/structures-list-selector/structures-list-selector.component";
import {RoleResponse} from "../../models/roles/role-response";
import {
  StructuresListSelectorItemComponent
} from "../../components/structures-list-selector/structures-list-selector-item/structures-list-selector-item.component";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {BehaviorSubject} from "rxjs";
import {scheduleObservable} from "rxjs/internal/scheduled/scheduleObservable";

// Define a type for the elements in the structures array

export const structuresSelectionType: { [key: string]: number } = {
  "PLANT_MANAGER": 0,
  "PRODUCT_SECTION_MANAGER": 1,
  "SEGMENT_MANAGER": 2,
  "LINE_MANAGER": 3,
  "WORKER": 3,
  "RH_SEGMENT": 2,
  "DOCTOR": 0,
  "NURSE": 0
};

export const structuresSelectionTitle: { [key: string]: string } = {
  "PLANT_MANAGER": "Sélection de plant ",
  "PRODUCT_SECTION_MANAGER": "Sélection de product section",
  "SEGMENT_MANAGER": "Sélection de segment pour chef segment",
  "LINE_MANAGER": "Sélection des line pour contre-maitre",
  "WORKER": "Sélection de line pour employer",
  "RH_SEGMENT": "Sélection de segment pour RH",
  "DOCTOR": "Sélection de segment pour le médecin",
  "NURSE": "Sélection de segment pour l'infirmière"
};

@Component({
  selector: 'app-create-user-details',
  templateUrl: './create-user-details.component.html',
  styleUrl: './create-user-details.component.css'
})
export class CreateUserDetailsComponent implements OnInit{
  @ViewChildren(StructuresListSelectorComponent) children!: QueryList<StructuresListSelectorComponent>;
  @ViewChild('userRole') plantDropdown!: ElementRef<HTMLSelectElement>;

  phoneRegex: RegExp = /^(5|2|9|4|7|3)\d*/;
  private _usersBS = new BehaviorSubject<UserResponse[]>([]);

  roles:RoleResponse[]=[]
  drawer: DrawerInterface|null = null

  selectedRole:RoleResponse|undefined;
  constructor(
    private authService:AuthService,
    private rolesService:RolesService,
    private toastr:ToastrService,
    private userTableService:UserTableService
  ) {
  }
  ngOnInit(): void {
    initFlowbite()
    this.initRoles()
    this.selectedRole=this.roles[0]

    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-right-example');

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
  registerRequest: RegisterRequest = {userInfo:{}};
  confirmPassword:string=""

  initRoles(){
    this.rolesService.getAllRoles()
      .subscribe({
        next: (response) => {
          this.roles = response
        }
      });
  }

  showCreateUserDrawer(){
    this.drawer?.show()
  }

  verifyInput(){

  if(this.confirmPassword!=this.registerRequest.userInfo.password){
    this.toastr.error("le mot de passe de confirmation n'est pas le même")
    return
  }
  this.registerRequest.userInfo.role=this.selectedRole?.name
  const fullUserReq = this.fillStructuresSelectionsTables(this.registerRequest)
  if (!this.registerRequest?.userInfo.email)
  {
    this.toastr.error("vous n'avez pas rempli l'email 😊")
    return
  }
  if (!this.registerRequest?.userInfo.password)
  {
    this.toastr.error("vous n'avez pas rempli le mot de passe 😊")
    return
  }
  if (!this.registerRequest?.userInfo.role)
  {
    this.toastr.error("vous n'avez pas sélectionné de rôle 😊")
    return
  }
  if (!this.registerRequest?.userInfo.firstname)
  {
    this.toastr.error("vous n'avez pas rempli le prénom 😊")
    return
  }
  if (!this.registerRequest?.userInfo.lastname)
  {
    this.toastr.error("vous n'avez pas rempli le nom de famille 😊")
    return
  }
  if (!this.registerRequest?.userInfo.phone)
  {
    this.toastr.error("vous n'avez pas rempli le numéro de téléphone 😊")
    return
  }
  if (!this.phoneRegex.test(this.registerRequest?.userInfo.phone))
  {
    this.toastr.error("le numéro de téléphone doit commencer par 2,3,4,5,7,9 😊")
    return
  }
  if (this.registerRequest?.userInfo.password.length<8 )
  {
    this.toastr.error("le mot de passe doit comporter au moins 8 caractères")
    return
  }
  if (this.registerRequest?.userInfo.password!=this.confirmPassword)
  {
    this.toastr.error("les mots de passe ne sont pas les mêmes")
    return
  }
  if (!fullUserReq)
  {
    this.toastr.error("vous n'avez pas sélectionné les structures 😊")
    return
  }
  return fullUserReq;
}
  registerUser() {

  const fullUserReq =this.verifyInput();
  if(!fullUserReq)
    return

  this.authService.register(fullUserReq)
    .subscribe({
      next: (response:UserResponse) => {
        response.createdNow=true
        this.drawer?.hide()
        this.toastr.success("Utilisateur créé")
        this.userTableService.addUser(response)
        this.registerRequest= {userInfo:{}}
        this.confirmPassword=""
        this.plantDropdown.nativeElement.value = '';

      },
      error:(message)=>{

        if(message.error!==null)
          this.toastr.error(message.error)
        else
          this.toastr.error("vérifiez la duplication de l'email ou du numéro de téléphone")

      }
    });
}
  selectRole(value: any) {
    this.selectedRole= this.getRoleById(value.target.value)
  }

  getRoleById(id:number){
    let roleFound:RoleResponse={};
    this.roles.forEach(role=> {
      if (role.id == id) {
        roleFound = role;return
      }
    })
    return roleFound
  }
  fillStructuresSelectionsTables(user:RegisterRequest){
    for (const ch of this.children) {
      switch (ch.structureType) {
        case "PLANT_MANAGER": {
          if (ch.getSelectedPlantsIds().includes(Number.NaN)) {
            return undefined
          }
          user.plantsManagingIds = ch.getSelectedPlantsIds()
          break
        }
        case "PRODUCT_SECTION_MANAGER": {
          if (ch.getSelectedPSsIds().includes(Number.NaN)) {

            return undefined


          }
          user.productSectionsManagingIds = ch.getSelectedPSsIds()
          break
        }
        case "SEGMENT_MANAGER": {
          if (ch.getSelectedSegmentsIds().includes(Number.NaN)) {
            return undefined


          }
          user.segmentsManagingIds = ch.getSelectedSegmentsIds();
          break
        }
        case "LINE_MANAGER": {
          if (ch.getSelectedLinesIds().includes(Number.NaN)) {
            return undefined

          }
          user.linesManagingIds = ch.getSelectedLinesIds();
          break
        }
        case "WORKER": {
          if (ch.getSelectedLinesIds().includes(Number.NaN)) {
            return undefined
          }
          user.lineWorkingId = ch.getSelectedLinesIds()[0]
          break
        }
        case "RH_SEGMENT": {
          if (ch.getSelectedSegmentsIds().includes(Number.NaN)) {
            return undefined
          }
          user.resourceHumanSegmentsIds = ch.getSelectedSegmentsIds();
          break
        }
        case "DOCTOR": {
          if (ch.getSelectedPlantsIds().includes(Number.NaN)) {
            return undefined

          }
          user.plantDoctorId = ch.getSelectedPlantsIds()[0];
          break
        }
        case "NURSE": {
          if (ch.getSelectedPlantsIds().includes(Number.NaN)) {
            return undefined

          }
          user.plantNurseId = ch.getSelectedPlantsIds()[0];
          break
        }

      }
    }

    return user
  }

  protected readonly alert = alert;
  protected readonly SelectionType = SelectionType;
  protected readonly structuresSelectionType = structuresSelectionType;
  protected readonly structuresSelectionTitle = structuresSelectionTitle;
}
