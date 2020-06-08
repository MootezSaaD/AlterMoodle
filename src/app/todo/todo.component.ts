import { Component, OnInit, OnDestroy } from "@angular/core";
import { AssignmentService } from "../services/assignment.service";
import { Observable } from "rxjs";
import { CourseAssignment } from "../models/courseAssignment.model";
import { Router } from "@angular/router";
import { StatisticsService } from '../services/statistics.service';
import * as moment from "moment";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"]
})
export class TodoComponent implements OnInit, OnDestroy {
  assignments$: Observable<CourseAssignment[]>;
  constructor(
    private assignmentService: AssignmentService,
    private statisticsService: StatisticsService,
    private router: Router
  ) {}
  beginTimer: number;
  ngOnDestroy() {
    this.statisticsService.storeTimeSpent(
      'ToDo',
      this.beginTimer,
      Date.now()
    );
  }

  ngOnInit() {
    this.beginTimer = Date.now();
    this.assignments$ = this.assignmentService.assignments$;
  }

  onSelect(assignment) {
    this.router.navigate(["/dashboard/todo", assignment._id]);
    console.log(assignment._id);
  }
}
