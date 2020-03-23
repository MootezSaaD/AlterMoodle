import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-user-ddmenu",
  templateUrl: "./user-ddmenu.component.html",
  styleUrls: ["./user-ddmenu.component.css"]
})
export class UserDdmenuComponent implements OnInit {
  constructor(private authSerivce: AuthService) {}

  fullName = "";
  ngOnInit() {
    this.fullName =
      this.authSerivce.getCurrentUser.firstName +
      " " +
      this.authSerivce.getCurrentUser.lastName;
  }
}
