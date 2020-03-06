import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class JwtService {
  // Sets the token at local storage with value 'access_token'
  setToken(token: string) {
    localStorage.setItem("access_token", token);
  }

  // Retrieves the access_token
  getToken(): string {
    return localStorage.getItem("access_token");
  }

  // Deletes token
  deleteToken() {
    localStorage.removeItem("access_token");
  }
}
