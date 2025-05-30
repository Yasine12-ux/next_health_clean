import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthInterceptor} from "../auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Provide the interceptor
  ]
})
export class AuthInterceptorModule { }
