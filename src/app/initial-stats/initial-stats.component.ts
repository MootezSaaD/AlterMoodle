import { Component, OnInit } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { AssignmentService } from "../services/assignment.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-initial-stats",
  templateUrl: "./initial-stats.component.html",
  styleUrls: ["./initial-stats.component.css"],
})
export class InitialStatsComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private assignmentService: AssignmentService,
    private spinner: NgxSpinnerService
  ) {}
  nbrOfCourses: number;
  currentUser: any;
  nbrOfAssignments: number;
  loaded = false;
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.nbrOfCourses = this.currentUser.courses.length;
    this.assignmentService.getNbrOfAssignments().subscribe((res) => {
      this.nbrOfAssignments = res;
      this.loaded = true;
    });
  }
}
