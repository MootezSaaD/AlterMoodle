import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CourseAssignment } from "../models/courseAssignment.model";
import { AssignmentService } from "../services/assignment.service";
import { StatisticsService } from "../services/statistics.service";

@Component({
  selector: "app-course-assignments",
  templateUrl: "./course-assignments.component.html",
  styleUrls: ["./course-assignments.component.css"],
})
export class CourseAssignmentsComponent implements OnInit {
  courseAssignments$: any;
  coursName: string;
  course: CourseAssignment;
  courseID: number;
  statusMsg: string;
  data: any;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private statisticsService: StatisticsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.coursName = this.route.snapshot.params["coursName"];
    this.assignmentService.searchCourse(this.coursName);
    this.assignmentService.currentCourse.subscribe({
      next: (a) => {
        this.assignCourse(a);
        this.assignCourseID(a);
        this.getCourseProgress();
      },
      error: (error) => {
        console.log(error);
      },
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
  assignCourse(c: CourseAssignment) {
    this.course = c;
  }
  assignCourseID(c: CourseAssignment) {
    if (c) {
      this.courseID = c.courseInfo.courseID;
    }
  }
  getCourseProgress() {
    if (this.courseID > 0) {
      this.statisticsService
        .getCourseAProgress(this.courseID)
        .subscribe((res) => {
          this.data = res;
          console.log(this.data);
        });
    }
  }
}
