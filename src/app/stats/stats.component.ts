import { Component, OnInit, OnDestroy } from "@angular/core";
import { TranscriptService } from "../services/transcript.service";
import { CourseGrade } from "../models/courseGrade.model";
import { Observable } from "rxjs";
import { AssignmentService } from "../services/assignment.service";
import { CourseAssignment } from "../models/courseAssignment.model";
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"],
})
export class StatsComponent implements OnInit, OnDestroy {
  constructor(
    private transcriptService: TranscriptService,
    private statisticsService: StatisticsService
  ) {}
  beginTimer: number;
  transcript$: Observable<CourseGrade[]>;
  ngOnInit() {
    this.beginTimer = Date.now();
    this.transcript$ = this.transcriptService.transcript$;
  }
  ngOnDestroy() {
    this.statisticsService.storeTimeSpent("InitialStats", this.beginTimer, Date.now());
  }
}
