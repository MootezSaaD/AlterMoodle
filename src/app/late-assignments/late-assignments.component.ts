import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Assignment } from '../models/assignment.model';

@Component({
  selector: 'app-late-assignments',
  templateUrl: './late-assignments.component.html',
  styleUrls: ['./late-assignments.component.css']
})
export class LateAssignmentsComponent implements OnInit {
  empty = false;
  @Input() lateAssignments: BehaviorSubject<Assignment[]>;

  constructor() { }

  ngOnInit() {
    console.log("passed",this.lateAssignments.value, this.lateAssignments.value.length);
  }

}
