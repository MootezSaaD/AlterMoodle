import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as Feather from "feather-icons";


@Component({
  selector: 'app-late-assignment-element',
  templateUrl: './late-assignment-element.component.html',
  styleUrls: ['./late-assignment-element.component.css']
})
export class LateAssignmentElementComponent implements AfterViewInit, OnInit {

  @Input() name: string;
  @Input() url: string;
  @Input() date: string;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Feather.replace();
  }
}
