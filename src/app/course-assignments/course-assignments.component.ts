import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CourseAssignment } from "../models/courseAssignment.model";
import { AssignmentService } from "../services/assignment.service";
import { StatisticsService } from "../services/statistics.service";
import { Assignment } from '../models/assignment.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: "app-course-assignments",
  templateUrl: "./course-assignments.component.html",
  styleUrls: ["./course-assignments.component.css"],
})
export class CourseAssignmentsComponent implements OnInit {
  courseAssignments$: any;
  coursName: string;
  course: CourseAssignment;
  lateAssignments = new BehaviorSubject<Assignment[]>([]);
  courseID: number;
  statusMsg: string;
  data: any;
  page = 1;
  pageSize = 4;
  collectionSize: number;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private statisticsService: StatisticsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.coursName = this.route.snapshot.params["coursName"];
    this.assignmentService.searchCourse(this.coursName);
    this.assignmentService
      .fetchLateAssignments(this.coursName)
      .subscribe((res) => {
        this.lateAssignments.next(res);
      });
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
    if (c) {
            this.course = c;
            this.collectionSize = c.assignment.length;
          }
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
  get assignments(): Assignment[] {
    if (this.course) {
      return this.course.assignment
      .map((assignment, i) => ({nbr: i + 1, ...assignment}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }
}
