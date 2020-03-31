import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CourseAssignment } from "../models/courseAssignment.model";
import { Observable } from "rxjs";
import { AssignmentService } from "../services/assignment.service";

@Component({
  selector: "app-course-assignments",
  templateUrl: "./course-assignments.component.html",
  styleUrls: ["./course-assignments.component.css"]
})
export class CourseAssignmentsComponent implements OnInit {
  assignments$: any;
  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit() {}
}
