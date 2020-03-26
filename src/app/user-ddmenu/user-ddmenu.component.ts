import { Component, OnInit } from "@angular/core";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "app-user-ddmenu",
  templateUrl: "./user-ddmenu.component.html",
  styleUrls: ["./user-ddmenu.component.css"]
})
export class UserDdmenuComponent implements OnInit {
  constructor(private storageService: StorageService) {}
  currentUser: any;
  fullName = "";
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.fullName =
      this.currentUser.firstName + " " + this.currentUser.lastName;
  }
}
