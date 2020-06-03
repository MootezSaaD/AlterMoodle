import { Component, OnInit, OnDestroy } from "@angular/core";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { SubmissionService } from "../services/submission.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subimission } from "../models/submission.model";
import { NgForm } from "@angular/forms";
import { AssignmentService } from "../services/assignment.service";
import * as moment from "moment";
import { StatisticsService } from '../services/statistics.service';


@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"],
})
export class EditorComponent implements OnInit, OnDestroy {
  beginTimer: number;
  public Editor = DecoupledEditor;
  private assignmentID: string;
  public contentdata = {
    _assignment: "",
    content: "",
  };
  submitClicked = false;
  successMessageSave = "";
  successMessageUpload = "";
  url = "";
  public body = "";
  public bodyArrived = false;
  public saved = false;
  constructor(
    private submissionService: SubmissionService,
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit() {
    this.beginTimer = Date.now();
    this.assignmentID = this.route.snapshot.params["id"];
    this.submissionService.getSubmissionContent(this.assignmentID).subscribe({
      next: (data: any) => {
        this.body = data.data;
        this.bodyArrived = true;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  onSubmit(form: NgForm) {
    // Saving submissing without uploading it to moodle
    if (!this.submitClicked) {
      this.saved = true;
      this.contentdata._assignment = this.assignmentID;
      this.submissionService
        .saveSubmission(this.contentdata, this.assignmentID)
        .subscribe({
          next: (data: any) => {
            this.successMessageSave = data.message;
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
      // uploading to moodle
    } else {
      if (this.saved) {
        this.contentdata._assignment = this.assignmentID;
        this.submissionService.uploadSubmission(this.assignmentID).subscribe({
          next: (data: any) => {
            this.successMessageUpload = data.message;
            this.url = data.url;
          },
          error: (error) => {
            console.log(error);
          },
        });
        // Change the assignments status to "done"
        this.assignmentService.markAsDone(this.assignmentID).subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
      } else {
        alert("Please save your work before uploading");
      }
    }
  }
  public onSubmitSubmission(): void {
    this.submitClicked = true;
  }
  public onSaveSubmission(): void {
    this.submitClicked = false;
  }
  ngOnDestroy() {
    this.statisticsService.storeTimeSpent({
      duration: Date.now() - this.beginTimer,
      day: moment().format("dddd"), // Sunday
      monthYr: moment().format("MMM Do YYYY"), // May 3rd 2020
      activity: "Editor",
    });
  }
}
