import { Component, OnInit } from "@angular/core";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"]
})
export class EditorComponent implements OnInit {
  constructor() {}
  public Editor = DecoupledEditor;
  ngOnInit() {}
  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
}
