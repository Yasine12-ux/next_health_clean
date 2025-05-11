import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ChangePasswordComponent } from './pages/reset/change-password/change-password.component';
import { ResetComponent } from './pages/reset/reset.component';
import { HomeComponent } from "./pages/home/home.component";
import { loginGuard } from "./guard/login.guard";
import { forgetPassGuard } from "./guard/forget-pass.guard";
import { NotifTableComponent } from "./notification/notif-table/notif-table.component";
import { permissionGuard } from "./guard/permission.guard";
import { tokenGuard } from "./guard/token.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'reset',
    component: ResetComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [forgetPassGuard],
  },
  {
    path: 'not-found',
    component: WelcomeComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [loginGuard,tokenGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'structures',
        loadChildren: () => import('./structures/structures.module').then(m => m.StructuresModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
      },
      {
        path: 'rh',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'inf',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'doctor',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'ml',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'ms',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'psManager',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'plantManager',
        loadChildren: () => import('./appointment-management/appointment-management.module').then(m => m.AppointmentManagementModule),
      },
      {
        path: 'medical-records',
        loadChildren: () => import('./medical-records/medical-records.module').then(m => m.MedicalRecordsModule),
      },
      {
        path: 'notfications',
        component: NotifTableComponent,
        canActivate: [loginGuard, tokenGuard],
      },
    ]
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
