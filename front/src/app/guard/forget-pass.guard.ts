import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {TokenStorageService} from "../services/auth-services/token-storage.service";



export const forgetPassGuard: CanActivateFn = (route, state) => {
 const router =inject(Router);
 const tokenService = inject(TokenStorageService);
 if (!tokenService.isUserLoggedIn()) {
 setTimeout(() => {
    sessionStorage.removeItem("code");
    sessionStorage.removeItem("email");
  }, 300000 );
  if (sessionStorage.getItem('email') && sessionStorage.getItem('code')!==null) {
    return true;
  } else {
    router.navigate(['/reset']); return false;
  }}
 return true;

};
