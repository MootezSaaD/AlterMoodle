import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { User } from "../models/user.model";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private authenticated: boolean;

  constructor(private httpClient: HttpClient, private jwtService: JwtService) {
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
          return res;
        })
      );
  }

  register(user: User): Observable<any> {
    return this.httpClient.post(
      "http://localhost:3000/api/user/register",
      user
    );
  }

  getUserInfo(): Observable<any> {
    return this.httpClient.get(`http://localhost:3000/api/user/profile`);
  }

  getUserPayload() {
    if (this.jwtService.getToken()) {
      this.getUserInfo().subscribe({
        next: (res: any) => {
          this.setAuth(res);
        },
        error: err => {
          this.purgeAuth();
        }
      });
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    this.jwtService.setToken(user.token);
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

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public get getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  getCurrentUserObs(): Observable<User> {
    return this.currentUser;
  }
}
