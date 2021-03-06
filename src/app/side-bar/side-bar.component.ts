import { Component, AfterViewInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import * as Feather from "feather-icons";
import { Title } from "@angular/platform-browser";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements AfterViewInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private titleSerivce: Title,
    private storageService: StorageService
  ) {
    this.titleSerivce.setTitle("Dashboard");
  }

  ngAfterViewInit() {
    Feather.replace();
  }
  Logout() {
    this.storageService.deleteUser();
    this.authService.purgeAuth();
    this.router.navigateByUrl("/login");
  }
}
