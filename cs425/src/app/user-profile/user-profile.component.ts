import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  fullName = "";
  email = "";
  moodleToken = "";
  constructor(private titleSerivce: Title, private authService: AuthService) {
    this.titleSerivce.setTitle("Profile");
  }

  ngOnInit() {
    this.fullName =
      this.authService.getCurrentUser.firstName +
      " " +
      this.authService.getCurrentUser.lastName;
    this.email = this.authService.getCurrentUser.email;
    this.moodleToken = this.authService.getCurrentUser.moodleToken;
  }
}
