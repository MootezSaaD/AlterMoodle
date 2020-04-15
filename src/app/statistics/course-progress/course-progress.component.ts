import { Component, OnInit } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "app-course-progress",
  templateUrl: "./course-progress.component.html",
  styleUrls: ["./course-progress.component.css"],
})
export class CourseProgressComponent implements OnInit {
  constructor() {}
  data = [
    {
      name: "Finished",
      value: 1,
    },
    {
      name: "Unfinished",
      value: 2,
    },
  ];
  colorScheme = {
    domain: ["#2ecc71", "#fa4251"],
  };
  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view = [700, 250];
  ngOnInit() {}
}
