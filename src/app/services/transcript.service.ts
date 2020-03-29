import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CourseGrade } from "../models/courseGrade.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TranscriptService {
  private subject = new BehaviorSubject<CourseGrade[]>([]);
  transcript$: Observable<CourseGrade[]> = this.subject.asObservable();

  constructor(private httpClient: HttpClient) {}

  init() {
    this.httpClient
      .get("http://localhost:3000/api/moodle/grades")
      .subscribe((transcript: CourseGrade[]) => {
        this.subject.next(transcript);
      });
  }
}
