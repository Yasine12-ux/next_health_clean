import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../pages/home/home.component";
import {RolesComponent} from "./roles.component";
import {loginGuard} from "../guard/login.guard";
import {permissionGuard} from "../guard/permission.guard";
import {tokenGuard} from "../guard/token.guard";

const routes: Routes = [


      {
        path: "",
        component: RolesComponent,
        canActivate:[permissionGuard,tokenGuard],
      data: { title: 'ROLE_MANAGEMENT' }
      }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
