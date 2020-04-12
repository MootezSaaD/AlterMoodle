import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { User } from "../models/user.model";
import { JwtService } from "./jwt.service";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private authenticated: boolean;

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private storageService: StorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>({} as User);
    this.currentUser = this.currentUserSubject
      .asObservable()
      .pipe(distinctUntilChanged());
    this.authenticated = false;
  }

  login(authCredentials: any): Observable<User> {
    return this.httpClient
      .post("http://localhost:3000/api/user/login", authCredentials)
      .pipe(
        map((res: any) => {
          this.setAuth(res);
          this.storageService.saveUser(res);
          return res;
        })
      );
  }

  register(user: User): Observable<any> {
    return this.httpClient.post("http://localhost:3000/api/user/signup", user);
  }

  setAuth(user: User) {
    this.jwtService.setToken(user.userToken);
    this.setUser(user);
    this.authenticated = true;
  }

  setUser(user: User) {
    console.log("Set user", user);
    this.currentUserSubject.next(user);
  }

  purgeAuth() {
    console.log("Session has been purged");
    this.jwtService.deleteToken();
    this.currentUserSubject.next({} as User);
    this.authenticated = false;
  }

  getUserPayload() {
    const token = this.jwtService.getToken();
    if (token) {
      console.log(token);
      const userPayload = atob(token.split(".")[0]);
      return JSON.parse(userPayload);
    } else {
      return false;
    }
  }

  public isAuthenticated(): boolean {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      const currentTime = new Date().getTime() / 1000;
      return userPayload.exp > currentTime;
    } else {
      return false;
    }
  }

  public get getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  getCurrentUserObs(): Observable<User> {
    return this.currentUser;
  }

  enteremail(emailModel: any): Observable<any> {
    return this.httpClient.post(
      `http://localhost:3000/api/user/forgot-password`,
      emailModel  
    );
  }
tokenValidation (token :String){
  return this.httpClient.get(
    `http://localhost:3000/api/user/reset-password/` + token
  )
}
enterPassword(token: String, password: any){
  return this.httpClient.post (
    `http://localhost:3000/api/user/change-password/`+token, password
  )
}

}
