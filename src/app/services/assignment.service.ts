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
  public currentCourse = new BehaviorSubject<CourseAssignment>(null);
  private subject = new BehaviorSubject<CourseAssignment[]>([]);
  public nbrOfAssignmentsSubject = new BehaviorSubject<number>(0);
  public nbrOfUnAssignmentsSubject = new BehaviorSubject<number>(0);
  public assignments$: Observable<
    CourseAssignment[]
  > = this.subject.asObservable();
  private nbrOfAssignments = 0;
  private nbrOfUnfinishedAssignments = 0;

  constructor(private httpClient: HttpClient) {}

  async init() {
    /**
     * First, we need to fetch/update the assignment list from moodle.
     * We will call the the "/get/mdl/assignments" API End-Point.
     * Then, we will call the "assignments" API End-Point to get the old and
     * new fetched assignments from the database
     */
    await this.httpClient
      .get("http://localhost:3000/api/moodle/get/mdl/assignments")
      .toPromise()
      .then((res) => {
        console.log(res);
        return;
      });
    await this.httpClient
      .get("http://localhost:3000/api/moodle/assignments/status/update")
      .toPromise()
      .then((res) => {
        console.log(res);
        return;
      });
    await this.httpClient
      .get<CourseAssignment[]>("http://localhost:3000/api/moodle/assignments")
      .toPromise()
      .then((assignments: CourseAssignment[]) => {
        this.subject.next(assignments);
        assignments.forEach((assignment) => {
          this.nbrOfAssignments += assignment.assignment.length;
          assignment.assignment.forEach((a) => {
            if (!a.status) {
              this.nbrOfUnfinishedAssignments++;
            }
          });
        });
        this.nbrOfAssignmentsSubject.next(this.nbrOfAssignments);
        this.nbrOfUnAssignmentsSubject.next(this.nbrOfUnfinishedAssignments);
      });
  }
  getNbrOfAssignments() {
    return this.nbrOfAssignmentsSubject;
  }

  getNbrOfUnfinishedAssigments() {
    return this.nbrOfUnAssignmentsSubject;
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
    this.nbrOfUnfinishedAssignments--;
    this.nbrOfUnAssignmentsSubject.next(this.nbrOfUnfinishedAssignments);
    return this.httpClient.put(
      "http://localhost:3000/api/moodle/assignment/" + assignmentID,
      null
    );
  }
  searchCourse(courseName: string) {
    this.assignments$
      .pipe(
        map((ca: CourseAssignment[]) => {
          let a = ca.find((c) => c._id === courseName);
          this.currentCourse.next(a);
        })
      )
      .subscribe((c) => {});
  }
}
