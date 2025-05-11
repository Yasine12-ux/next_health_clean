import { Injectable } from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {UserData} from "../../models/user-data";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {DecodedToken} from "./DecodedToken";

const TOKENS_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const Ref_Token = 'refresh-token';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {



  constructor(private cookie:CookieService) { }

  isUserLoggedIn(): boolean {
    return this.cookie.get(TOKENS_KEY).toString()!== "";
  }
  signOut(): void {
    // window.sessionStorage.clear();
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, _] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    this.cookie.deleteAll('/');

  }

  public saveToken(token: string): void {
    // window.sessionStorage.removeItem(TOKENS_KEY);
    // window.sessionStorage.setItem(TOKENS_KEY, token);
    const expirationInDays = 7;
    const expirationTime = new Date().getTime() + (expirationInDays * 24 * 60 * 60 * 1000 );
    this.cookie.delete(TOKENS_KEY)
    this.cookie.set(TOKENS_KEY, token,{ expires: new Date(expirationTime) ,path:'/' })
    this.cookie.delete("expireDateToken")
    this.cookie.set("expireDateToken",new Date(expirationTime).toString(),{ expires: new Date(expirationTime) ,path:'/' })

  }
  public saveRefreshToken(token: string): void {
    // window.sessionStorage.removeItem(TOKENS_KEY);
    // window.sessionStorage
    const expirationInDays = 7;
    const expirationTime = new Date().getTime() + (expirationInDays * 24 * 60 * 60 * 1000 );
    this.cookie.delete(Ref_Token)
    this.cookie.set(Ref_Token, token,{ expires: new Date(expirationTime) ,path:'/' })
  }
  public getRefreshToken(): string | null {
    return this.cookie.get(Ref_Token);
  }
  public getToken(): string  {
    return this.cookie.get(TOKENS_KEY);
  }




  public saveUser(user: any): void {
    const expirationInDays = 7;
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));

    // Delete the existing cookie
    this.cookie.delete(USER_KEY);

    // Decode the JWT token and cast to DecodedToken
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(user.accessToken);
    decodedToken.permissions=decodedToken.permissions.sort()

    // Check if any permission includes the word "DASHBOARD"
    const dashboardPermission = decodedToken.permissions.find(permission => /DASHBOARD/i.test(permission));
    if (dashboardPermission) {
      // Remove the dashboard permission from its current position
      decodedToken.permissions = decodedToken.permissions.filter(permission => permission !== dashboardPermission);

      // Add the dashboard permission to the start of the array
      decodedToken.permissions.unshift(dashboardPermission);
      // Set the cookie with the modified decoded token
      this.cookie.set(USER_KEY, JSON.stringify(decodedToken),{ expires: new Date(expirationTime) , path:'/' });
    } else {
      this.cookie.set(USER_KEY, JSON.stringify(decodedToken),{ expires: new Date(expirationTime) , path:'/' });
    }
  }


  public getUser(): any {
    const user = this.cookie.get(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}

