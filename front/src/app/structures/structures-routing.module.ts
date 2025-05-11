import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../pages/home/home.component";
import {StructureComponent} from "./structure.component";
import {PlantComponent} from "./structure/plant/plant.component";
import {ProductSectionComponent} from "./structure/product-section/product-section.component";
import {SegmentComponent} from "./structure/segment/segment.component";
import {LineComponent} from "./structure/line/line.component";
import {loginGuard} from "../guard/login.guard";
import {permissionGuard} from "../guard/permission.guard";
import {tokenGuard} from "../guard/token.guard";

const routes: Routes = [



      {
        path:"",component:StructureComponent,
        canActivate:[permissionGuard,tokenGuard],
        data: { title: 'STRUCTURE_MANAGEMENT' }
        ,
        children:[
          {
            path:"" ,redirectTo:"plant", pathMatch:"full"
          },
          {
            path:"plant" ,
            component:PlantComponent,
            canActivate:[tokenGuard],

          },
          {
            path:"product-section" ,
            component:ProductSectionComponent,
            canActivate:[tokenGuard]
          },
          {
            path:"segment" ,
            component:SegmentComponent,
            canActivate:[tokenGuard]
          },
          {
            path:"line" ,
            component:LineComponent,
            canActivate:[tokenGuard]
          },

        ]
      },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule { }
