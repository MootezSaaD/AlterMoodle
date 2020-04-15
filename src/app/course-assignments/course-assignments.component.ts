import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CourseAssignment } from "../models/courseAssignment.model";
import { Observable } from "rxjs";
import { AssignmentService } from "../services/assignment.service";
import { switchMap, map, filter } from "rxjs/operators";

@Component({
  selector: "app-course-assignments",
  templateUrl: "./course-assignments.component.html",
  styleUrls: ["./course-assignments.component.css"],
})
export class CourseAssignmentsComponent implements OnInit {
  courseAssignments$: any;
  coursName: string;
  course: CourseAssignment;
  statusMsg: string;
  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.coursName = this.route.snapshot.params["coursName"];
    this.assignmentService.searchCourse(this.coursName);
    this.assignmentService.currentCourse.subscribe((a) => {
      this.course = a;
    });
  }
  onSelect(assigment) {
    this.router.navigate(["dashboard/editor/", assigment.id]);
  }
  done(assigment) {
    this.assignmentService.markAsDone(assigment.id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.statusMsg = data.message;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
