import {Component, EventEmitter, Input, numberAttribute, OnInit, Output} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import {permissionPages} from "../components/side-bar/side-bar.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  maximized:number=1;

  constructor( ) {
  }
  ngOnInit(): void {

  }

}
