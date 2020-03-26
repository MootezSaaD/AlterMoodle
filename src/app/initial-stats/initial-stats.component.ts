import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { StorageService } from "../services/storage.service";
import { User } from "../models/user.model";

@Component({
  selector: "app-initial-stats",
  templateUrl: "./initial-stats.component.html",
  styleUrls: ["./initial-stats.component.css"]
})
export class InitialStatsComponent implements OnInit {
  constructor(private storageService: StorageService) {}
  nbrOfCourses: number;
  currentUser: any;
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.nbrOfCourses = this.currentUser.courses.length;
  }
}
