import {CanActivateFn, Router} from '@angular/router';
import { inject } from "@angular/core";
import { RolesService } from "../services/roles.service";
import { TokenStorageService } from "../services/auth-services/token-storage.service";
import {ToastrService} from "ngx-toastr";
import {permissionPages} from "../pages/components/side-bar/side-bar.component";
import {AuthService} from "../services/auth-services/auth.service";
import {TokenResponse} from "../models/tokenResponse";
export const permissionGuard: CanActivateFn = (route, state) => {
  const tokenStorageService = inject(TokenStorageService);
  const router= inject(Router)

  const userPermissions = (tokenStorageService.getUser()?.permissions || []).sort();
  const allowedPermissions = route.data['title'].toString();
  const hasPermission = userPermissions.some((permission: any) => allowedPermissions.includes(permission));
  // if allowed permission table
  // const allowedPermissions = route.data['title'].toString().split(',');
  // const hasPermission = allowedPermissions.some((permission: string) => userPermissions.includes(permission));

let  ISvalid= false;
let stateUrl = "/";

// if (stateUrl === '/') {
//   router.navigateByUrl(permissionPages[userPermissions[0]]);
//   return hasPermission;
// }

  if (!hasPermission ) {
   router.navigateByUrl('/not-found');
    return false;
  }

if (!state.url.startsWith('/home')) {
  for (let i = 0; i <= userPermissions.length; i++) {

    if (permissionPages[userPermissions[i]].endsWith(state.url)) {
      ISvalid = true;
      stateUrl = permissionPages[userPermissions[i]] + "/";
break;
    }
  }


  if (hasPermission && ISvalid)
  { router.navigateByUrl(stateUrl);
    state.url = stateUrl;
return false;
  }
}
if (state.url === '/home') {
  router.navigateByUrl(permissionPages[userPermissions[0]]);

  return hasPermission;
}

};
