import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserLog } from "../models/userlog.model";
import * as moment from "moment";
import { Grade } from '../models/grade.model';

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}

  getCourseAProgress(courseId: number) {
    return this.httpClient.get(
      `http://localhost:3000/api/stats/progress/${courseId}`
    );
  }
  getUserLogs() {
    return this.httpClient.get<UserLog[]>(
      "http://localhost:3000/api/stats/fetch/logs"
    );
  }
  storeTimeSpent(activityName: string, startTime: number, endTime: number) {
    this.httpClient
      .post("http://localhost:3000/api/stats/record/time", {
        duration: endTime - startTime,
        day: moment().format("dddd"), // Sunday
        monthYr: moment().format("MMM Do YYYY"), // May 3rd 2020
        activity: activityName,
      })
      .subscribe();
  }
  getTimeSpent() {
    return this.httpClient.get("http://localhost:3000/api/stats/time-spent");
  }
  getAvgTimeSpent() {
    return this.httpClient.get("http://localhost:3000/api/stats/avg-time");
  }
  getCourseGrades(courseID: number) {
    return this.httpClient.get<Grade[]>(
      `http://localhost:3000/api/stats/grades/${courseID}`
    );
  }
}
