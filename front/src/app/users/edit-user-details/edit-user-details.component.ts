import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {Drawer, type DrawerInterface, type DrawerOptions, initFlowbite, type InstanceOptions} from "flowbite";
import {RegisterRequest} from "../../models/register-request";
import {copyUserResponse, FullUserResponse, UserResponse} from "../../models/user-response";
import {UsersService} from "../../services/users.service";
import {UserTableService} from "../service/user-table.service";
import {RolesService} from "../../services/roles.service";
import {ToastrService} from "ngx-toastr";
import {structuresSelectionTitle, structuresSelectionType} from "../create-user-details/create-user-details.component";
import {RoleResponse} from "../../models/roles/role-response";
import {
  StructuresListSelectorComponent
} from "../../components/structures-list-selector/structures-list-selector.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrl: './edit-user-details.component.css'
})
export class EditUserDetailsComponent implements OnInit{
  @ViewChildren(StructuresListSelectorComponent) children!: QueryList<StructuresListSelectorComponent>;

  userToModify:FullUserResponse={userInfo:{}}
  drawer: DrawerInterface|null = null

  roles:RoleResponse[]=[]
  selectedRole:RoleResponse|undefined;

  structuresSelectionDefault: { [key: string]: ((number|undefined)[]|undefined) } = {}

  constructor(
    private userService:UsersService,
    private rolesService:RolesService,
    private toastr:ToastrService,
    private userTableService:UserTableService
  ) {}

  ngOnInit(): void {
    initFlowbite()
    this.initRoles()

    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-right-edit-user');

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

  initRoles(){
    this.rolesService.getAllRoles()
      .subscribe({
        next: (response) => {
          this.roles = response
        }
      });
  }

  showDrawer(fullUserResponse:FullUserResponse){
    this.userToModify=fullUserResponse
    this.drawer?.show()
    this.structuresSelectionDefault = {
      "PLANT_MANAGER": fullUserResponse.plantsManagingIds,
      "PRODUCT_SECTION_MANAGER": fullUserResponse.productSectionsManagingIds,
      "SEGMENT_MANAGER": fullUserResponse.segmentsManagingIds,
      "LINE_MANAGER": fullUserResponse.linesManagingIds,
      "WORKER": [fullUserResponse.lineWorkingId],
      "RH_SEGMENT": fullUserResponse.resourceHumanSegmentsIds,
      "DOCTOR": [fullUserResponse.plantDoctorId],
      "NURSE": [fullUserResponse.plantNurseId]
    }
    if(fullUserResponse.userInfo.role)
      this.selectedRole=this.getRoleByName(fullUserResponse.userInfo.role)

  }
  selectRole(value: any) {

    this.selectedRole=this.getRoleById(value.target.value)
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

  getRoleByName(name:string){
    let roleFound:RoleResponse={};
    this.roles.forEach(role=> {
      if (role.name == name) {
        roleFound = role;return
      }
    })
    return roleFound
  }


  phoneRegex: RegExp = /^(5|2|9|4|7|3)\d*/;
  private _usersBS = new BehaviorSubject<UserResponse[]>([]);
  modifyUser() {
    if(this.userToModify){
      this.userToModify.userInfo.role=this.selectedRole?.name
      const fullUserReq = this.fillStructuresSelectionsTables(this.userToModify)
if (!fullUserReq?.userInfo.email)
{
  this.toastr.error("vous n'avez pas rempli l'email 😊")
  return
}

if (!fullUserReq?.userInfo.role)
{
  this.toastr.error("vous n'avez pas sélectionné de rôle 😊")
  return
}
if (!fullUserReq?.userInfo.firstname)
{
  this.toastr.error("vous n'avez pas rempli le prénom 😊")
  return
}
if (!fullUserReq?.userInfo.lastname)
{
  this.toastr.error("vous n'avez pas rempli le nom de famille 😊")
  return
}
if (!fullUserReq?.userInfo.phone)
{
  this.toastr.error("vous n'avez pas rempli le numéro de téléphone 😊")
  return
}
if (!this.phoneRegex.test(fullUserReq?.userInfo.phone))
{
  this.toastr.error("le numéro de téléphone doit commencer par 2,3,4,5,7,9 😊")
  return
}
if(!fullUserReq) {
  this.toastr.error("vous avez manqué de remplir les entrées de structure 😊")
  return
}






this.userService.modifyUser(this.userToModify)
.subscribe({
  next: (response:any) => {
    this.drawer?.hide()
    this.toastr.success("Utilisateur mis à jour")
    this.userTableService.modifyUser(response)
    this.userToModify= {userInfo:{}}
  },
  error:(message)=>{
    if (message.error != null)
      this.toastr.error(message.error)
    else
      this.toastr.error("vérifiez l'email ou le numéro s'ils existent 😊")

  }
});

    }
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


  protected readonly structuresSelectionType = structuresSelectionType;
  protected readonly structuresSelectionTitle = structuresSelectionTitle;



}
