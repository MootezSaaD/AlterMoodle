import { Component, OnInit } from "@angular/core";
import { TranscriptService } from "../services/transcript.service";
import { CourseGrade } from "../models/courseGrade.model";
import { Observable } from "rxjs";
import { AssignmentService } from "../services/assignment.service";
import { CourseAssignment } from "../models/courseAssignment.model";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit {
  constructor(
    private transcriptService: TranscriptService,
    private assignmentService: AssignmentService
  ) {}
  transcript$: Observable<CourseGrade[]>;
  assignments$: Observable<CourseAssignment[]>;
  nbrOfassignments = 0;
  nbOfUnfinishedAssignments = 0;
  nbrOfFinishedAssignments = 0;

  ngOnInit() {
    this.transcript$ = this.transcriptService.transcript$;
    this.assignments$ = this.assignmentService.assignments$;
    this.nbrOfassignments = this.assignmentService.getNbrOfAssignments();
    this.nbOfUnfinishedAssignments = this.assignmentService.getNbrOfUnfinishedAssigments();
    this.nbrOfFinishedAssignments =
      this.nbrOfassignments - this.nbOfUnfinishedAssignments;
    console.log(this.assignments$);
    console.log(this.transcript$);
  }
}
