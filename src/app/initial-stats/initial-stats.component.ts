import { Component, OnInit, OnDestroy } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { AssignmentService } from "../services/assignment.service";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-initial-stats",
  templateUrl: "./initial-stats.component.html",
  styleUrls: ["./initial-stats.component.css"],
})
export class InitialStatsComponent implements OnInit, OnDestroy {
  constructor(
    private storageService: StorageService,
    private assignmentService: AssignmentService,
    private spinner: NgxSpinnerService
  ) {}
  nbrOfCourses: number;
  currentUser: any;
  nbrOfAssignments = new BehaviorSubject<number>(0);
  loaded = false;
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.nbrOfCourses = this.currentUser.courses.length;
    this.assignmentService.getNbrOfAssignments().subscribe((res) => {
      this.nbrOfAssignments.next(res);
      this.loaded = true;
    });
  }
  ngOnDestroy() {
    this.nbrOfAssignments.unsubscribe();
  }
}
