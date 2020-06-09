import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-course-progress",
  templateUrl: "./course-progress.component.html",
  styleUrls: ["./course-progress.component.css"],
})
export class CourseProgressComponent implements OnInit {
  constructor() {}
  @Input() data: any;

  colorScheme = {
    domain: ["#2ecc71", "#fa4251"],
  };
  infoMessage =
    "This metric helps you to have an overall idea about the completion of the assignments";
  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view = [700, 250];
  ngOnInit() {
  }
}
