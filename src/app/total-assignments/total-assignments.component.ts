import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { AssignmentService } from '../services/assignment.service';
import { CourseAssignment } from '../models/courseAssignment.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-total-assignments',
  templateUrl: './total-assignments.component.html',
  styleUrls: ['./total-assignments.component.css']
})
export class TotalAssignmentsComponent implements OnInit,AfterViewInit  {

  constructor(private assignmentService: AssignmentService) { }
  assignments$: Observable<CourseAssignment[]>;
  nbrOfassignments = 0;
  nbOfUnfinishedAssignments = 0;
  nbrOfFinishedAssignments = 0;
  firstLoaded = false;
  secondLoaded = false;
  view = [700, 450];
  colorScheme = {
    domain: ["#2ecc71", "#fa4251"],
  };
  data: any;
  ngOnInit() {
    this.assignments$ = this.assignmentService.assignments$;
    this.assignmentService.getNbrOfAssignments().subscribe((res) => {
      this.nbrOfassignments = res;
      this.firstLoaded = true;
    });
    this.assignmentService.nbrOfUnAssignmentsSubject.subscribe((res) => {
      this.nbOfUnfinishedAssignments = res;
      this.nbrOfFinishedAssignments = this.nbrOfassignments - res;
      this.secondLoaded = true;
    });
  }
  ngAfterViewInit(){
    if(this.firstLoaded && this.secondLoaded) {
      this.data = [
        {
          name: "Finished",
          value: this.nbrOfFinishedAssignments,
        },
        {
          name: "Unfinished",
          value: this.nbOfUnfinishedAssignments,
        },
      ];
    }
  }

}
