import { Component } from '@angular/core';
import {ResetService} from "../../services/auth-services/reset.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {map, takeWhile, timer} from "rxjs";
import { ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {

  constructor(private toastr:ToastrService,private resetService: ResetService,private _fb: FormBuilder, private router: Router) {
  }
  ForgotPasswordForm = this._fb.group({
    email: ['',[Validators.required, Validators.email]],
    code: [''],


  })
  hided = false;
  forgotPassword(){

    if (this.ForgotPasswordForm.value.email == ''){
this.toastr.error('Veuillez entrer l\'email.');
}
    else {


      this.resetService.checkEmail(this.ForgotPasswordForm.value).subscribe(
        res => {

         this.toastr.success('Email envoyé');
          this.hided = true;
          this.startCountdown();

          this.resetService.sendEmail(this.ForgotPasswordForm.value).subscribe(
            res => {

            },
            err => {

            }
          )

        },
        err => {

       this.toastr.error('L\'email n\'existe pas');
          this.hided = false;
        }
      )
    }
  }
  checkCode(){
    if (this.ForgotPasswordForm.value.code == ''){
this.toastr.error('Veuillez entrer le code');
    }
    this.resetService.checkCode(this.ForgotPasswordForm.value).subscribe(

      res => {

        sessionStorage.setItem('email', <string>this.ForgotPasswordForm.value.email)
        sessionStorage.setItem('code', <string>this.ForgotPasswordForm.value.code)


        this.router.navigateByUrl("/change-password")
      },
      err => {

       this.toastr.error('Veuillez entrer le code correct');
      }
    )
  }

  submited(){
    if(this.hided){
      this.checkCode()
    }else{
      this.forgotPassword()
    }
  }

  timecheck()
  {
    if(this.timerExpired)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  timerExpired = false;
  countdownSeconds: number = 0;
  countdownInterval: any;
  startCountdown() {
    this.countdownSeconds = 20;
    this.countdownInterval = setInterval(() => {
      this.countdownSeconds--;

      if (this.countdownSeconds <= 0) {
        this.timerExpired = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }


  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  resend() {
    this.forgotPassword();
    this.timerExpired = false; // Reset the timerExpired flag
  }


  cancel()
  {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('code');
  }
}
