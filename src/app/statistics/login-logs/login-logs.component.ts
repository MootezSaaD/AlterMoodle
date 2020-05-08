import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "src/app/services/statistics.service";
import { UserLog } from "src/app/models/userlog.model";

@Component({
  selector: "app-login-logs",
  templateUrl: "./login-logs.component.html",
  styleUrls: ["./login-logs.component.css"],
})
export class LoginLogsComponent implements OnInit {
  logs: UserLog[] = [];
  // TODO: Re-implement table of access log by adding pagination
  page = 1;
  pageSize = 1;

  constructor(private statsSerivce: StatisticsService) {}

  ngOnInit() {
    this.statsSerivce.getUserLogs().subscribe({
      next: (res) => {
        this.logs = res;
        console.log(this.logs);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
