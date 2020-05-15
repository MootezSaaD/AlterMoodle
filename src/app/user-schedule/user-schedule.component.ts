import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as Feather from "feather-icons";

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { Subject, Observable, BehaviorSubject } from "rxjs";
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
export class UserScheduleComponent implements OnInit, AfterViewInit {
  constructor(private calendarService: CalendarService) {}
  // Days Of the Week
  days = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
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
  loaded = false;
  // Date template
  baseDate: Date;
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
  eventsArr: CalendarEvent[] = [];
  private subject = new BehaviorSubject<CalendarEvent[]>([]);
  public events$: Observable<CalendarEvent[]> = this.subject.asObservable();
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
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
      this.refresh.next();
    }
    this.eventsArr = [...this.eventsArr];
    this.subject.next(this.eventsArr);
    console.log("All events => ", this.eventsArr);
  }

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.eventsArr = this.eventsArr.filter((iEvent) => iEvent !== event);
      this.subject.next(this.eventsArr);
      this.externalEvents.push(event);
    }
  }

  onSubmit(form: NgForm) {
    const event = this.eventBuilder(form.value);
    console.log(event);
    this.eventsArr.push(event);
    this.eventsArr = [...this.eventsArr];
    this.subject.next(this.eventsArr);
    console.log(this.eventsArr);
  }
  save() {
    // delete actions from each event
    this.eventsArr.forEach((event) => {
      delete event.actions;
    });
    const eventArray = this.eventsArr.map((event) => JSON.stringify(event));
    this.calendarService.saveCalendar({ events: eventArray }).subscribe({
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
      title: preEvent.title,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      start: new Date(
        this.baseDate.getFullYear(),
        this.baseDate.getMonth(),
        this.baseDate.getDate(),
        preEvent.starTtime.hour,
        preEvent.starTtime.minute,
        preEvent.starTtime.second
      ),
      end: new Date(
        this.baseDate.getFullYear(),
        this.baseDate.getMonth(),
        this.baseDate.getDate(),
        preEvent.endTime.hour,
        preEvent.endTime.minute,
        preEvent.endTime.second
      ),
      color: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
      },
      actions: [
        {
          label: "[X] ",
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.eventsArr = this.eventsArr.filter(
              (iEvent) => iEvent !== event
            );
            this.subject.next(this.eventsArr);
            console.log("After Deletion", this.eventsArr);
          },
        },
      ],
    };
    return event;
  }

  ngOnInit() {
    this.calendarService.fetchCalendar().subscribe({
      next: (res: any) => {
        this.calendarService.cleanEventsDates(res.events);
        this.loadEvents(res.events);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngAfterViewInit() {
    Feather.replace();
  }
  loadEvents(es) {
    console.log(es);
    es.forEach((event) => {
      // Add delete action
      event.actions = [
        {
          label: "[X] ",
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.eventsArr = this.eventsArr.filter(
              (iEvent) => iEvent !== event
            );
            this.subject.next(this.eventsArr);
            console.log("After Deletion", this.eventsArr);
          },
        },
      ];
      this.eventsArr.push(event);
    });
    this.eventsArr = [...this.eventsArr];
    this.subject.next(this.eventsArr);
    console.log(this.eventsArr);
    this.loaded = true;
    console.log(this.loaded);
  }
  selectDay(evt) {
    this.getNightlyType(evt.target.value);
  }
  getNightlyType(country: any) {
    for (let element in this.days) {
      if (element === country) {
        let selectedDate = this.days[element];
        let curr = new Date();
        for (let i = 0; i <= 6; i++) {
          let first = curr.getDate() - curr.getDay() + i;
          let start = new Date(curr.setDate(first));
          if (start.getDay() === parseInt(selectedDate)) {
            this.baseDate = new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate()
            );
          }
        }
        break;
      }
    }
  }
}
