import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(private httpClient: HttpClient) {}

  saveCalendar(calendar: any) {
    return this.httpClient.post(
      "http://localhost:3000/api/misc/calendar/save",
      calendar
    );
  }
  fetchCalendar() {
    return this.httpClient.get("http://localhost:3000/api/misc/calendar");
  }
  cleanEventsDates(events) {
    for (const event of events) {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
    }
  }
}
