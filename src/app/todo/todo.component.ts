import { Component, OnInit } from "@angular/core";
import { AssignmentService } from "../services/assignment.service";
import { Observable } from "rxjs";
import { CourseAssignment } from "../models/courseAssignment.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"]
})
export class TodoComponent implements OnInit {
  assignments$: Observable<CourseAssignment[]>;
  constructor(
    private assignmentService: AssignmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.assignments$ = this.assignmentService.assignments$;
  }

  onSelect(assignment) {
    this.router.navigate(["/dashboard/todo", assignment._id]);
    console.log(assignment._id);
  }
}
