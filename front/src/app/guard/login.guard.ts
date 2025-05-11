import {ActivatedRoute, CanActivateFn, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {inject} from "@angular/core";
import {TokenStorageService} from "../services/auth-services/token-storage.service";

export const loginGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);

  const userPermissions = tokenStorage.getUser()?.permissions || [];
  const toastrService = inject(ToastrService);

  if (tokenStorage.isUserLoggedIn() && ((state.url === '/login' ) )) {
    if (userPermissions===undefined || userPermissions.length===0) {
      tokenStorage.signOut();
      toastrService.error("Veuillez vérifier vos informations.");
    } else {
      router.navigateByUrl('/home');
      return false;
    }
  } else if (tokenStorage.isUserLoggedIn()) {
    return true;
  } else if (!tokenStorage.isUserLoggedIn() && (state.url !== '/login' )) {
    router.navigateByUrl('/login');
    return false;
  } else if (state.url === '') {
    router.navigateByUrl('/home');
    return false;
  }

  return true;
};
