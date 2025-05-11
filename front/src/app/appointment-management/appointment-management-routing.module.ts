import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppointmentManagementComponent} from "./appointment-management.component";
import {AppointmentsTableComponent} from "./table/appointments-table/appointments-table.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {BlockOutComponent} from "./block-out/block-out.component";
import {AppointmentDashBoardComponent} from "./appointment-dash-board/appointment-dash-board.component";
import {DashbordComponent} from "./Dashboads/dashbord/dashbord.component";
import {permissionGuard} from "../guard/permission.guard";
import {tokenGuard} from "../guard/token.guard";
import {PieChartsComponent} from "./Dashboads/dashbord/pie-chart/pie-chart.component";

const routes: Routes = [
  {
    path:"inf/appointments",component:AppointmentManagementComponent,
    data: { title: 'NURSE_APPOINTMENT' },
    canActivate :[tokenGuard,permissionGuard],
    children:[
      {
      path: "list",
      component:AppointmentsTableComponent,
        canActivate:[tokenGuard]
    },
      {
      path: "calendar",
      component:CalendarComponent,
        canActivate:[tokenGuard]
    },
    ]
  },
  {
    path:"rh/appointments",component:AppointmentManagementComponent,
    data: { title: 'RH_APPOINTMENT'   },
    canActivate :[tokenGuard,permissionGuard],
    children:[{
      path: "list",
      component:AppointmentsTableComponent,
      canActivate:[tokenGuard]
    },{
      path: "calendar",
      component:CalendarComponent,
      canActivate:[tokenGuard]
    },

    ]
  },
  {
    path:"doctor/appointments",component:AppointmentManagementComponent,
    data: { title: 'DOCTOR_APPOINTMENT' },
    canActivate :[tokenGuard,permissionGuard],
    children:[{
      path: "list",
      component:AppointmentsTableComponent
    }
      ,

    ]
  },
  {
    path:"manager-line/appointments",component:AppointmentManagementComponent,
    data: { title: 'LINE_MANAGER_APPOINTMENT' },
    canActivate :[tokenGuard,permissionGuard],
    children:[{
      path: "list",
      component:AppointmentsTableComponent,
      canActivate:[tokenGuard]
    },{
      path: "calendar",
      component:CalendarComponent,
      canActivate:[tokenGuard]
    }
    ,
    ]
  },

  {
    path:"manager-segment/appointments",component:AppointmentManagementComponent,
    data: { title: 'SEGMENT_MANAGER_APPOINTMENT' },
    canActivate :[tokenGuard,permissionGuard],
    children:[{
      path: "list",
      component:AppointmentsTableComponent,
      canActivate:[tokenGuard]
    },{
      path: "calendar",
      component:CalendarComponent,
      canActivate:[tokenGuard]
    }
      ,
    ]
  }
,




  {
    path:"inf/blockout",
    component:BlockOutComponent,
    data: { title: 'BLOCK_OUT_APPOINTMENT' },
    canActivate :[tokenGuard,permissionGuard],

  },
  {
    path:"manager-line/dashboard",
    component:DashbordComponent,
    data: { title: 'LINE_MANAGER_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],

  },
  {
    path:"doctor/dashboard",
    component:DashbordComponent,
    data: { title: 'DOCTOR_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],
  },
  {
    path:"inf/dashboard",
    component:AppointmentDashBoardComponent,
    data: { title: 'NURSE_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],
  },
  {
    path:"rh/dashboard",
    component:AppointmentDashBoardComponent,
    data: { title: 'RH_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],
  },
  {
    path:"manager-segment/dashboard",
    component:DashbordComponent,
    data: { title: 'SEGMENT_MANAGER_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],

  }
  ,{
    path:"psManager/dashboard",
    component:DashbordComponent,
    data: { title: 'PS_MANAGER_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],

  },
  {
    path:"plantManager/dashboard",
    component:DashbordComponent,
    data: { title: 'PLANT_MANAGER_DASHBOARD' },
    canActivate :[tokenGuard,permissionGuard],

  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentManagementRoutingModule {

}
