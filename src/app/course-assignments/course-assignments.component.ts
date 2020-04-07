import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CourseAssignment } from "../models/courseAssignment.model";
import { Observable } from "rxjs";
import { AssignmentService } from "../services/assignment.service";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-course-assignments",
  templateUrl: "./course-assignments.component.html",
  styleUrls: ["./course-assignments.component.css"],
})
export class CourseAssignmentsComponent implements OnInit {
  courseAssignments$: any;
  coursId: string;
  course: Observable<void>;
  test: CourseAssignment;
  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.coursId = this.route.snapshot.params["coursName"];
    this.test = this.assignmentService.getCourseAssignments(this.coursId);
    console.log(this.test);
  }
  onSelect(assigment) {
    this.router.navigate(["dashboard/editor/", assigment.id]);
  }
}
