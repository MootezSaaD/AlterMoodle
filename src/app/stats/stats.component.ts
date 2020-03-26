import { Component, OnInit } from "@angular/core";
import { TranscriptService } from "../services/transcript.service";
import { Course } from "../models/course.model";
import { Observable } from "rxjs";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit {
  constructor(private transcriptService: TranscriptService) {}
  transcript: Course[];
  ngOnInit() {
    // this.transcriptService.getTranscript().subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });
    // this.transcript = this.transcriptService.getTranscript();
    // console.log(this.transcript);
    this.transcriptService.fetchTranscript().subscribe(transcript => {
      this.transcript = transcript;
      console.log(this.transcript);
    });
  }
}
