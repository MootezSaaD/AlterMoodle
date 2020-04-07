import { Component, OnInit } from "@angular/core";
import { TranscriptService } from "./services/transcript.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  title = "AlterMoodle";
  ngOnInit() {
    this.router.navigateByUrl("/dashboard/home");
  }
}
