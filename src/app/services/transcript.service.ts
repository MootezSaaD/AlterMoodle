import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Course } from "../models/course.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TranscriptService {
  private transcriptSubject = new BehaviorSubject<Course[]>([]);

  constructor(private httpClient: HttpClient) {
    // Once this service is loaded it will make a GET request to the server
    // and stores the courses+grades (i.e transcript) in transcriptSubject
    this.httpClient
      .get("http://localhost:3000/api/moodle/grades")
      .subscribe((transcript: Course[]) => {
        this.transcriptSubject.next(transcript);
      });
  }
  fetchTranscript() {
    return this.transcriptSubject.asObservable();
  }
}
