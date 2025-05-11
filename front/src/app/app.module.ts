  import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HomeComponent } from './pages/home/home.component';
import { SideBarComponent } from './pages/components/side-bar/side-bar.component';
import { SideBarButtonComponent } from './pages/components/side-bar/side-bar-button/side-bar-button.component';
import {CdkTableModule} from "@angular/cdk/table";
import {NgOptimizedImage} from "@angular/common";
import {UsersModule} from "./users/users.module";
import {RolesModule} from "./roles/roles.module";
import {ResetComponent} from "./pages/reset/reset.component";
import {ChangePasswordComponent} from "./pages/reset/change-password/change-password.component";
import {CountdownModule} from "ngx-countdown";
import { ProfileComponent } from './pages/components/side-bar/profile/profile.component';
import {CookieService} from "ngx-cookie-service";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {AuthInterceptorModule} from "./interceptors/auth-interceptor/auth-interceptor.module";
import { NotificationComponent } from './notification/notification.component';
import { NotifTableComponent } from './notification/notif-table/notif-table.component';
import {
  ConfirmationDialogComponent
} from "./pages/components/dialogs/comfirmation-dialog/confirmation-dialog.component";
import {PaginationComponent} from "./components/tables-components/pagination/pagination.component";
  import {CKEditorModule} from "@ckeditor/ckeditor5-angular";



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    HomeComponent,
    SideBarComponent,
    SideBarButtonComponent,
    ResetComponent,
    ChangePasswordComponent,
    ProfileComponent,
    NavBarComponent,

    NotificationComponent,
    NotifTableComponent,

  ],
  imports: [
    RolesModule,
    UsersModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CdkTableModule,
    CountdownModule,
    AuthInterceptorModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right' // Specify your desired position
    }),
    NgOptimizedImage,
    ConfirmationDialogComponent,
    PaginationComponent,



  ],

  providers: [HttpClient,CookieService],
  exports: [
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
