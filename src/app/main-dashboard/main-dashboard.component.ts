import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';
import * as moment from "moment";

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
    this.statisticsService.storeTimeSpent({
      duration: Date.now() - this.beginTimer,
      day: moment().format("dddd"), // Sunday
      monthYr: moment().format("MMM Do YYYY"), // May 3rd 2020
      activity: "MainDashboard",
    });
  }

}
