import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtService } from "./jwt.service";

@Injectable({
  providedIn: "root",
})
export class SubmissionService {
  constructor(private httpClient: HttpClient) {}

  saveSubmission(content: any, assignmentID: string) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.post(
      "http://localhost:3000/api/moodle/submission/" + assignmentID,
      content,
      { headers }
    );
  }
  getSubmissionContent(assignmentID: string) {
    return this.httpClient.get(
      "http://localhost:3000/api/moodle/submission/" + assignmentID
    );
  }

  uploadSubmission(assignmentID: string) {
    return this.httpClient.post(
      `http://localhost:3000/api/moodle/submission/add/${assignmentID}`,
      null
    );
  }
}
