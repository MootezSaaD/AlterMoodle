import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { JwtService } from "../services/jwt.service";
import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtSerivce: JwtService,
    private storageService: StorageService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.storageService.getUser()) {
      this.router.navigateByUrl("/login");
      this.jwtSerivce.deleteToken();
      this.storageService.deleteUser();
      return false;
    }
    return true;
  }
}
