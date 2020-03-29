import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { CourseAssignment } from "../models/courseAssignment.model";

@Injectable({
  providedIn: "root"
})
export class AssignmentService {
  private subject = new BehaviorSubject<CourseAssignment[]>([]);
  assignments$: Observable<CourseAssignment[]> = this.subject.asObservable();
  private nbrOfAssignments = 0;
  private nbrOfUnfinishedAssignments = 0;

  constructor(private httpClient: HttpClient) {}

  init() {
    /**
     * First, we need to fetch/update the assignment list from moodle.
     * We will call the the "/get-mdl-assignments" API End-Point.
     * Then, we will call the "assignments" API End-Point to get the old and
     * new fetched assignments from the database
     */
    this.httpClient
      .get("http://localhost:3000/api/moodle/get-mdl-assignments")
      .subscribe();
    this.httpClient
      .get("http://localhost:3000/api/moodle/assignments")
      .subscribe((assignments: CourseAssignment[]) => {
        this.subject.next(assignments);
        assignments.forEach(assignment => {
          this.nbrOfAssignments += assignment.assignment.length;
          assignment.assignment.forEach(a => {
            if (!a.status) {
              this.nbrOfUnfinishedAssignments++;
            }
          });
        });
      });
  }
  getNbrOfAssignments() {
    return this.nbrOfAssignments;
  }

  getNbrOfUnfinishedAssigments() {
    return this.nbrOfUnfinishedAssignments;
  }
}
