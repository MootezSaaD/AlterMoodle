import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(): boolean {
    if(!this.authService.isAuthenticated()) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }
  
}
