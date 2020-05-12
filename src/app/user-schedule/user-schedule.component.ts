import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { Subject } from "rxjs";
import { CalendarService } from "../services/calendar.service";

@Component({
  selector: "app-user-schedule",
  templateUrl: "./user-schedule.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./user-schedule.component.css"],
})

// Add a save button that will save all events to the database
// Add worth of 7 days * 24h in ms everytime it is fetched
// In the backend construct the day each time the database is requested
// let newDate = new Date();
// newDate.setDay() = doc.getDay();
// newDate.setMinutes() = doc.setDay(); etc..
// Store them in JSON files ? no need for db ? ==> problem is that many files will be created for each user
// TODO: add the delete function (search by course name, day, start date)
export class UserScheduleComponent implements OnInit {
  constructor(private calendarService: CalendarService) {}
  // Date picker
  model: NgbDateStruct;
  // Start Time Picker
  starTtime = { hour: 0, minute: 0 };
  // End Time Picker
  endTime = { hour: 0, minute: 0 };
  CalendarView = CalendarView;
  view = CalendarView.Week;
  viewDate = new Date();
  // Week starts from monday
  weekStartsOn = 1;
  // Exclude sunday
  excludeDays = [0];
  // Classes start from 8
  dayStartHour = 8;
  // Classes end 19h
  dayEndHour = 19;
  // This one will be updated and stored in/fetched from db.
  externalEvents: CalendarEvent[] = [];
  courseEvent = {
    title: "",
    color: {
      primary: "#1e90ff",
      secondary: "#D1E8FF",
    },
    start: new Date(),
    draggable: true,
  };
  events: CalendarEvent[] = [
    {
      title: "CS350",
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      start: new Date("2020-05-12T06:15:00.000Z"),
      end: new Date("2020-05-12T07:45:00.000Z"),
      color: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
      },
    },
    {
      title: "CS350",
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      start: new Date("2020-05-11T06:15:00.000Z"),
      end: new Date("2020-05-11T07:45:00.000Z"),
      color: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
      },
    },
  ];
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
      this.refresh.next();
    }
    if (this.view === "month") {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
    console.log("All events => ", this.events);
  }

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.externalEvents.push(event);
    }
  }

  onSubmit(form: NgForm) {
    const event = this.eventBuilder(form.value);
    console.log(event);
    this.events.push(event);
    this.events = [...this.events];
    console.log(this.events);
    // this.externalEvents.push({
    //   title: form.value.title,
    //   color: {
    //     primary: "#1e90ff",
    //     secondary: "#D1E8FF",
    //   },
    //   draggable: true,
    //   start,
    //   end,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    // });
  }
  save() {
    const eventArr = this.events.map((event) => JSON.stringify(event));
    this.calendarService.saveCalendar({ events: eventArr }).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  eventBuilder(preEvent) {
    const event = {
      id: preEvent.id,
      title: preEvent.title,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      start: new Date(
        preEvent.dp.year,
        preEvent.dp.month - 1,
        preEvent.dp.day,
        preEvent.starTtime.hour,
        preEvent.starTtime.minute,
        preEvent.starTtime.second
      ),
      end: new Date(
        preEvent.dp.year,
        preEvent.dp.month - 1,
        preEvent.dp.day,
        preEvent.endTime.hour,
        preEvent.endTime.minute,
        preEvent.endTime.second
      ),
      color: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
      },
    };
    return event;
  }

  ngOnInit() {}
}
