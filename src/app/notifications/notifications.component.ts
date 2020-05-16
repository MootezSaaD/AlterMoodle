import { Component, AfterViewInit } from "@angular/core";
import * as Feather from "feather-icons";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements AfterViewInit {
  constructor() {}

  notifications = true;

  ngAfterViewInit() {
    Feather.replace();
  }
}
