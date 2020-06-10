import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-course-grades-element',
  templateUrl: './course-grades-element.component.html',
  styleUrls: ['./course-grades-element.component.css']
})
export class CourseGradesElementComponent implements OnInit {
  @Input() item: string;
  @Input() grade: string;
  @Input() badge: string;
  constructor() { }

  ngOnInit() {
  }

}
