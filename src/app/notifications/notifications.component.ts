import { Component, AfterViewInit, OnInit } from "@angular/core";
import * as Feather from "feather-icons";
import { AssignmentService } from "../services/assignment.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements AfterViewInit, OnInit {
  constructor(private assignmentService: AssignmentService) {}

  notifications = false;
  assignments: any[];

  ngAfterViewInit() {
    Feather.replace();
  }
  ngOnInit() {
    this.assignmentService.fetchUrgentAssignments().subscribe({
      next: (res: any) => {
        this.assignments = res;
        this.notifications = true;
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
