import { Component, OnInit } from "@angular/core";
import { TranscriptService } from "../services/transcript.service";
import { AssignmentService } from "../services/assignment.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor(
    private transcriptService: TranscriptService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit() {
    this.transcriptService.init();
    this.assignmentService.init();
  }
}
