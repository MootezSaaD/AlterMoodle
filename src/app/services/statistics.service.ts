import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

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
}
