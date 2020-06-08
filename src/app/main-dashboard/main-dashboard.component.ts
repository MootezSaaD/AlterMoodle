import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  constructor(private statisticsService: StatisticsService) { }

  beginTimer: number;

  ngOnInit() {
    this.beginTimer = Date.now();
  }

  ngOnDestroy() {
    this.statisticsService.storeTimeSpent(
      'MainDashboard',
      this.beginTimer,
      Date.now()
    );
  }

}
