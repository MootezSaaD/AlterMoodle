import { Component, OnInit } from "@angular/core";
import { TranscriptService } from "./services/transcript.service";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private titleSerivce: Title) {
    this.titleSerivce.setTitle("AlterMoodle v1.0");
  }
  title = "AlterMoodle";
  ngOnInit() {
  }
}
