import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {TokenStorageService} from "../services/auth-services/token-storage.service";
import {AuthService} from "../services/auth-services/auth.service";
import {ToastrService} from "ngx-toastr";

export const tokenGuard: CanActivateFn = (route, state) => {
  const tokenStorageService = inject(TokenStorageService);
  const auth = inject(AuthService)
  const toastrService = inject(ToastrService);
  const router= inject(Router)
  const token = tokenStorageService.getToken();

  auth.checkToken(token).subscribe({
    next: (response) => {
      if (response===false) {
        auth.checkToken(tokenStorageService.getRefreshToken()).subscribe({
          next: (response) => {
            if (response) {
              auth.refreshToken().subscribe({
                next: (response:any) => {
                  tokenStorageService.saveToken(response.accessToken);
                  return true;
                },
                error: (error) => {
                  return false;
                }
              });
            }
            else
            {
              tokenStorageService.signOut();
              router.navigateByUrl('/login');

              return false;
            }
            return true;
          },
          error: (error) => {

            return false;
          }
        });


      }
      return true;
    },
    error: (error) => {

      return false;
    }
  });
  return true;
};
