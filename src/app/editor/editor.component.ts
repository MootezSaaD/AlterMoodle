import { Component, OnInit } from "@angular/core";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { SubmissionService } from "../services/submission.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subimission } from "../models/submission.model";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"],
})
export class EditorComponent implements OnInit {
  public Editor = DecoupledEditor;
  private assignmentID: string;
  public contentdata = {
    _assignment: "",
    content: "",
  };
  submitClicked = false;
  successMessage = "";
  public body = "";
  public bodyArrived = false;
  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.assignmentID = this.route.snapshot.params["id"];
    this.submissionService.getSubmissionContent(this.assignmentID).subscribe({
      next: (data: any) => {
        console.log(data);
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
      this.contentdata._assignment = this.assignmentID;
      this.submissionService
        .saveSubmission(this.contentdata, this.assignmentID)
        .subscribe({
          next: (data: any) => {
            this.successMessage = data.message;
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
      // Saving submission and uploading to moodle
    } else {
    }
  }
  public onSubmitSubmission(): void {
    this.submitClicked = true;
  }
  public onSaveSubmission(): void {
    this.submitClicked = false;
  }
}
