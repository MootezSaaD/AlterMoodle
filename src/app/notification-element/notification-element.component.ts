import * as Feather from "feather-icons";
import { Component, AfterViewInit, Input } from "@angular/core";

@Component({
  selector: "app-notification-element",
  templateUrl: "./notification-element.component.html",
  styleUrls: ["./notification-element.component.css"],
})
export class NotificationElementComponent implements AfterViewInit {
  constructor() {}

  @Input() assignmentTitle: string;
  @Input() assignmentURL: string;
  @Input() duration: number;

  ngAfterViewInit() {
    Feather.replace();
  }
}
