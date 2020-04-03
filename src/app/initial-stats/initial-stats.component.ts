import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { StorageService } from "../services/storage.service";
import { User } from "../models/user.model";
import { AssignmentService } from "../services/assignment.service";

@Component({
  selector: "app-initial-stats",
  templateUrl: "./initial-stats.component.html",
  styleUrls: ["./initial-stats.component.css"]
})
export class InitialStatsComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private assignmentService: AssignmentService
  ) {}
  nbrOfCourses: number;
  currentUser: any;
  nbrOfAssignments: number;
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.nbrOfCourses = this.currentUser.courses.length;
    this.nbrOfAssignments = this.assignmentService.getNbrOfAssignments();
  }
}
