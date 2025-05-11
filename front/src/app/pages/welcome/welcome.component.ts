import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import {Router} from "@angular/router";
import {permissionPages} from "../components/side-bar/side-bar.component";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  userPermissions: string[]= [];
  routingPage: string="";
constructor(private tokenStorageService: TokenStorageService,private router: Router) {
  this.userPermissions = (this.tokenStorageService.getUser()?.permissions || []).sort();
  if(this.tokenStorageService.isUserLoggedIn()) {
    for (let i = 0; i < this.userPermissions.length; i++) {
      if (permissionPages[this.userPermissions[i]]!=undefined) {
        this.routingPage = permissionPages[this.userPermissions[i]];
        break;
      }
      this.routingPage = "/home";
  }

  }  else
    this.routingPage = "/login";
}






}
