import { Component, OnInit, OnDestroy    } from '@angular/core';
import { AssignmentService } from '../services/assignment.service';
import { CourseAssignment } from '../models/courseAssignment.model';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-total-assignments',
  templateUrl: './total-assignments.component.html',
  styleUrls: ['./total-assignments.component.css']
})
export class TotalAssignmentsComponent implements OnInit, OnDestroy    {

  constructor(private assignmentService: AssignmentService) { }
  assignments$: Observable<CourseAssignment[]>;
  nbrOfassignments = 0;
  nbOfUnfinishedAssignments = 0;
  nbrOfFinishedAssignments = 0;
  firstLoaded = false;
  secondLoaded = false;
  data = new BehaviorSubject<any>([]);
  view = [700, 300];
  colorScheme = {
    domain: ["#2ecc71", "#fa4251"],
  };
  ngOnInit() {
    this.assignments$ = this.assignmentService.assignments$;
    this.assignmentService.getNbrOfAssignments().subscribe((res) => {
      this.nbrOfassignments = res;
      this.firstLoaded = true;
    });
    this.assignmentService.getNbrOfUnfinishedAssigments().subscribe((res) => {
      this.nbOfUnfinishedAssignments = res;
      this.nbrOfFinishedAssignments = this.nbrOfassignments - res;
      this.secondLoaded = true;
      this.data.next([
        {
          name: 'Finished',
          value: this.nbrOfFinishedAssignments
        },{
          name: 'Unfinished',
          value: this.nbOfUnfinishedAssignments
        }
      ]);
    });

  }
  ngOnDestroy() {
  }

}
