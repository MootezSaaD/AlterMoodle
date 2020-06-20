import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AuthService } from "../services/auth.service";
import { StorageService } from '../services/storage.service';
import { User } from '../models/user.model';

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  fullName = "";
  email = "";
  moodleToken = "";
  user: User;
  constructor(private titleSerivce: Title, private authService: AuthService, private storageService: StorageService) {
    this.titleSerivce.setTitle("Profile");
  }

  ngOnInit() {
    this.user = this.storageService.getUser();
    this.fullName =
      this.user.firstName +
      " " +
      this.user.lastName;
    this.email = this.user.email;
    this.moodleToken = this.user.moodleToken;
    console.log(this.fullName);

  }
}
