import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  constructor(
    private routing:Router
  ) {
  }


  ngOnInit(): void {
    initFlowbite();
  }
}
