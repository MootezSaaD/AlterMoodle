import { Component, OnInit, Input } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "app-course-progress",
  templateUrl: "./course-progress.component.html",
  styleUrls: ["./course-progress.component.css"],
})
export class CourseProgressComponent implements OnInit {
  constructor() {}
  @Input() data;

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
