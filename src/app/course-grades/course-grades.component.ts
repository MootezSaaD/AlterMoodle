import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grade } from '../models/grade.model';

@Component({
  selector: 'app-course-grades',
  templateUrl: './course-grades.component.html',
  styleUrls: ['./course-grades.component.css']
})
export class CourseGradesComponent implements OnInit {

  @Input() grades: BehaviorSubject<Grade[]>;
  constructor() { }

  ngOnInit() {
  }

}
