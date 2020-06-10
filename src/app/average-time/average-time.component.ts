import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-average-time',
  templateUrl: './average-time.component.html',
  styleUrls: ['./average-time.component.css']
})
export class AverageTimeComponent implements OnInit {

  constructor(private statisticsService: StatisticsService) { }

  colorScheme = {
    domain: ['#2ecc71']
  };
  view: any[] = [400, 300];
  lodaded = false;
  data: any[];

  onSelect(event) {
    console.log(event);
  }
  ngOnInit() {
    this.statisticsService.getAvgTimeSpent().subscribe((res: any[]) => {
      this.data = res;
      this.lodaded = true;
    });
  }

}
