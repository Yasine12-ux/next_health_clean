import {Component, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  constructor(private token:TokenStorageService) {
  }
  role:any;

    ngOnInit(): void {
        initFlowbite();
      this.role = this.token.getUser().username;
    }
}
