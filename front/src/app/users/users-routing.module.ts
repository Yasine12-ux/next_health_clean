import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users.component";
import {HomeComponent} from "../pages/home/home.component";
import {loginGuard} from "../guard/login.guard";
import {permissionGuard} from "../guard/permission.guard";
import {tokenGuard} from "../guard/token.guard";

const routes: Routes = [
    {
      path:"",component:UsersComponent,
    data: { title: 'USER_MANAGEMENT' },
      canActivate :[permissionGuard,tokenGuard]
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {

}
