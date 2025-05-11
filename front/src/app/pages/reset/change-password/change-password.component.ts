import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ResetService} from "../../../services/auth-services/reset.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{

  constructor(private toastr:ToastrService,private resetService: ResetService,private _fb: FormBuilder, private router: Router,private tokenService: TokenStorageService ) {

  }
  changePass = this._fb.group({
    email: [sessionStorage.getItem('email'),[Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmationPassword: ['', [Validators.required, Validators.minLength(8)]],
  code: [''],
  })
  changePassw = this._fb.group({
    email: [this.tokenService.getUser().sub],
    currentPassword: ['', [Validators.required,]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmationPassword: ['', [Validators.required, Validators.minLength(8)]],
  })
formGroupdecider()
{

  if (this.tokenService.isUserLoggedIn())

    return this.changePassw;
  else
    return this.changePass;

}
  onSubmit() {
    if (!this.tokenService.isUserLoggedIn()) {

      this.changePass.value.code = sessionStorage.getItem('code');
      if (this.changePass.value.newPassword != this.changePass.value.confirmationPassword) {
this.toastr.error('les mots de passe ne correspondent pas');
return;
}
let newPassLength:any = this.changePass.value.newPassword?.length;
let confirmPassLength:any = this.changePass.value.confirmationPassword?.length;
if (newPassLength < 8) {
  this.toastr.error('le nouveau mot de passe doit comporter au moins 8 caractères');
  return;
}
if (confirmPassLength < 8) {
  this.toastr.error('le mot de passe de confirmation doit comporter au moins 8 caractères');
  return;
}

this.resetService.checkCode(this.changePass.value).subscribe(
(res) => {
  if (this.changePass.valid) {
    this.resetService.changeResetpass(this.changePass.value).subscribe(
      (res) => {
        this.toastr.success('Mot de passe changé avec succès');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('code');
        this.router.navigate(['/login']);
      },
      (error) => {
      }
    );
  } else
    this.toastr.error('Veuillez entrer des données valides');
},
(error) => {
  this.router.navigate(['/reset']);
}
);
} else {
if (this.changePassw.value.newPassword != this.changePassw.value.confirmationPassword) {
this.toastr.error('les mots de passe ne correspondent pas');
return;
}
let newPassLength:any = this.changePassw.value.newPassword?.length;
let confirmPassLength:any = this.changePassw.value.confirmationPassword?.length;
if (newPassLength < 8) {
this.toastr.error('le nouveau mot de passe doit comporter au moins 8 caractères');
return;
}
if (confirmPassLength < 8) {
this.toastr.error('le mot de passe de confirmation doit comporter au moins 8 caractères');
return;
}

      if (this.changePassw.valid)
      {
        this.resetService.changePass(this.changePassw.value).subscribe(
          (res) => {
  this.toastr.success('Mot de passe changé avec succès');
this.router.navigate(['/home']);
},
(error) => {
  this.toastr.error('vérifiez votre mot de passe actuel');
}
);}
else
  this.toastr.error('Veuillez entrer des données valides');

    }
  }

  hide()
  {
    if (this.tokenService.isUserLoggedIn())
      return true;
    else
      return false;
  }

cancelRoute()
{
  if (this.tokenService.isUserLoggedIn())
    return '/home';
  else
    return '/login';
}

  cancel()
  {
    if (this.tokenService.isUserLoggedIn())
      this.router.navigate(['/home']);
    else{
      this.router.navigate(['/login']);
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('code');}
  }
  ngOnInit(): void {
  }
}




