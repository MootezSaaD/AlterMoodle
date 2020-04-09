import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { CourseAssignment } from "../models/courseAssignment.model";
import { map, filter, tap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AssignmentService {
  private subject = new BehaviorSubject<CourseAssignment[]>([]);
  assignments$: Observable<CourseAssignment[]> = this.subject.asObservable();
  private nbrOfAssignments = 0;
  private nbrOfUnfinishedAssignments = 0;
  reAssignment: CourseAssignment;

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
      .get<CourseAssignment[]>("http://localhost:3000/api/moodle/assignments")
      .pipe(
        tap(() => {
          console.log("HTTP REQUEST DONE");
        }),
        map((res) => Object.values(res))
      )
      .subscribe((assignments: CourseAssignment[]) => {
        this.subject.next(assignments);
        assignments.forEach((assignment) => {
          this.nbrOfAssignments += assignment.assignment.length;
          assignment.assignment.forEach((a) => {
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

  getCourseAssignments(id: string) {
    let a = this.assignments$
      .pipe(
        map((assignments: CourseAssignment[]) => {
          assignments.forEach((assignment) => {
            if (assignment._id === id) {
              console.log("Found it !");
              console.log("IT IS => ", assignment);
              this.reAssignment = assignment;
              return assignment;
            }
          });
        })
      )
      .subscribe((a) => {});
    return this.reAssignment;
  }
  markAsDone(assignmentID: string) {
    const data = this.subject.getValue();
    let courseIdx = 0;
    let asgnIdx = 0;
    data.forEach((course, idx) =>
      course.assignment.forEach((assignment, aidx) => {
        if (assignment.id === assignmentID) {
          courseIdx = idx;
          asgnIdx = aidx;
        }
      })
    );
    let newCourses = data.slice(0);
    newCourses[courseIdx].assignment[asgnIdx] = {
      id: newCourses[courseIdx].assignment[asgnIdx].id,
      name: newCourses[courseIdx].assignment[asgnIdx].name,
      description: newCourses[courseIdx].assignment[asgnIdx].description,
      expDate: newCourses[courseIdx].assignment[asgnIdx].expDate,
      status: true,
      url: newCourses[courseIdx].assignment[asgnIdx].url,
    };
    this.subject.next(newCourses);
    return this.httpClient.put(
      "http://localhost:3000/api/moodle/assignment/" + assignmentID,
      null
    );
  }
}
