import {Component, OnInit} from '@angular/core';
import {UsersService} from "../services/users.service";
import {UserResponse} from "../models/user-response";
import { Subject } from 'rxjs';
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  constructor(
    private userService:UsersService
  ) {
  }
  ngOnInit(): void {
    initFlowbite()
  }
  title = 'Utilisateurs';
  dtTrigger:Subject<any>= new Subject<any>()

}

