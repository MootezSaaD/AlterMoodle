import { Component, AfterViewInit, OnInit } from "@angular/core";
import * as Feather from "feather-icons";
import { AssignmentService } from "../services/assignment.service";
import { Assignment } from '../models/assignment.model';

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
      next: (res: any[]) => {
        this.assignments = res;
        this.notifications = res.length > 0;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
