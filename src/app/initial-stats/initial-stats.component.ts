import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-initial-stats",
  templateUrl: "./initial-stats.component.html",
  styleUrls: ["./initial-stats.component.css"]
})
export class InitialStatsComponent implements OnInit {
  constructor(private authService: AuthService) {}
  nbrOfCourses: Number;
  ngOnInit() {
    this.nbrOfCourses = this.authService.getCurrentUser.courses.length;
  }
}
