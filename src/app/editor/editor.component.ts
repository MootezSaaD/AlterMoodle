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
  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.assignmentID = this.route.snapshot.params["id"];
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
    this.contentdata._assignment = this.assignmentID;
    this.submissionService
      .submitSubmission(this.contentdata, this.assignmentID)
      .subscribe({
        next: (data: any) => {
          this.router.navigateByUrl("/dashboard/home");
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
