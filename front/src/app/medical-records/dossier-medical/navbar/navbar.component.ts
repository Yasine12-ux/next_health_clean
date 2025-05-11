import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
access:boolean = false;
constructor(protected route: Router,private token:TokenStorageService) {

  const userPermissions = (token.getUser()?.permissions || []).sort();
  const allowedPermissions = 'DOSSIER_MEDICAL';

  const hasPermission = userPermissions.some((permission: any) => allowedPermissions.includes(permission));
  this.access = hasPermission;
}

}
