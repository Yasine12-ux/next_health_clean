import {Component, OnInit} from '@angular/core';
import {AuthenticationRequest} from "../../models/authentication-request";
import {Router} from "@angular/router";
import {VerificationRequest} from "../../models/verification-request";
import { AuthenticationResponse } from '../../models/authentication.response';
import { AuthService } from '../../services/auth-services/auth.service';
import {ToastrService} from "ngx-toastr";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import { jwtDecode } from "jwt-decode";
import {permissionPages} from "../components/side-bar/side-bar.component";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  authRequest: AuthenticationRequest = {email:"",password:""};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  passwordHide:boolean=true;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  permissions: string[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private tokenStorage: TokenStorageService,
    private cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.permissions = this.tokenStorage.getUser().roles;

    }    }

  authenticate() {
    this.authService.login(this.authRequest)

      .subscribe({
        next: (response) => {

          this.tokenStorage.saveToken(response.accessToken)

          this.tokenStorage.saveUser(response)
          this.tokenStorage.saveRefreshToken(response.refreshToken)
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.permissions = this.tokenStorage.getUser().permissions;
          if(this.permissions)
            this.router.navigate([permissionPages[this.permissions[0]]]);
        },
        error:(error)=>{

          this.isLoginFailed=true
this.toastr.error('Veuillez vérifier vos informations.');
}
      });
  }


}
