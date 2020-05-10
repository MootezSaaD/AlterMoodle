import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { Subject } from "rxjs";

@Component({
  selector: "app-user-schedule",
  templateUrl: "./user-schedule.component.html",
  styleUrls: ["./user-schedule.component.css"],
})
export class UserScheduleComponent implements OnInit {
  constructor() {}

  CalendarView = CalendarView;
  view = CalendarView.Month;
  viewDate = new Date();
  // This one will be updated and stored in/fetched from db.
  externalEvents: CalendarEvent[] = [
    {
      title: "Event 1",
      color: { primary: "#e3bc08", secondary: "#FDF1BA" },
      start: new Date(),
      draggable: true,
    },
    {
      title: "Event 2",
      color: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
      },
      start: new Date(),
      draggable: true,
    },
  ];

  events: CalendarEvent[] = [];

  activeDayIsOpen = false;

  refresh = new Subject<void>();

  eventDropped({
    event,
    newStart,
    newEnd,
    allDay,
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.externalEvents.indexOf(event);
    if (typeof allDay !== "undefined") {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === "month") {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
  }

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.externalEvents.push(event);
    }
  }

  ngOnInit() {}
}
