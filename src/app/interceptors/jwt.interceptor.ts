import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtService } from "../services/jwt.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  headers: {
    [name: string]: string | string[];
  };
  constructor(private jwtService: JwtService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const token = this.jwtService.getToken();
    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    }
    request = request.clone({ setHeaders: this.headers });
    return next.handle(request);
  }
}
