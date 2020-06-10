import { Component, OnInit, Input } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-avg-time-course',
  templateUrl: './avg-time-course.component.html',
  styleUrls: ['./avg-time-course.component.css']
})
export class AvgTimeCourseComponent implements OnInit {
  @Input() courseID: number;
  colorScheme = {
    domain: ['#2ecc71']
  };
  view: any[] = [300, 300];
  lodaded = false;
  data: any[];

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    this.statisticsService.getCourseAvgTimeSpent(this.courseID).subscribe((res: any[]) => {
      this.data = res;
      this.lodaded = true;
    });
  }

  onSelect(event) {
    console.log(event);
  }

}
