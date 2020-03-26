import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  constructor() {}

  // Save user in localstorage
  saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Get user from locastorage
  getUser(): any {
    let user = JSON.parse(localStorage.getItem("user"));
    return user;
  }
  // Remove user from localstorage
  deleteUser() {
    localStorage.removeItem("user");
  }
}
