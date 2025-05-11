import { RegisterRequest } from '../../models/register-request';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from '../../models/authentication.response';
import { VerificationRequest } from '../../models/verification-request';
import { AuthenticationRequest } from '../../models/authentication-request';
import {UserResponse} from "../../models/user-response";
import {Observable} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {environment} from "../../../environments/environment";

const UserbaseUrl = environment.apiUrlUsers
const AuthbaseUrl = environment.apiUrlAuth

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private tokenStorage:TokenStorageService) { }
  private getHeaders(): HttpHeaders {

    return new HttpHeaders().set("Authorization", `Bearer ${this.tokenStorage.getRefreshToken()}`);
  }
  login(authReq:AuthenticationRequest): Observable<any> {
    return this.http.post(AuthbaseUrl + '/authenticate', authReq);
  }

  register(
    registerRequest: RegisterRequest
  ) {
    return this.http.post<UserResponse>(`${UserbaseUrl}/user`, registerRequest);
  }

  checkToken(token : any){
    return this.http.post(`${AuthbaseUrl}/check-token/${token}`,{});
  }
  // verifyCode(verificationRequest:VerificationRequest){
  //   return this.http.post<AuthenticationResponse>(`${AuthbaseUrl}/verify`, verificationRequest);
  // }
  refreshToken() {
    return this.http.post(`${AuthbaseUrl}/refresh-token` ,null,{headers: this.getHeaders()});
  }
}
