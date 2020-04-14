import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { TranscriptService } from "../services/transcript.service";
import { AssignmentService } from "../services/assignment.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  userModel = {
    email: "",
    password: "",
  };
  errMsg: string;
  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title,
    private transcriptService: TranscriptService,
    private assignmentService: AssignmentService
  ) {
    this.titleService.setTitle("Login");
  }

  onSubmit(form: NgForm) {
    this.auth.login(form.value).subscribe({
      next: (data: any) => {
        this.router.navigateByUrl("/dashboard/home");
      },
      error: (error) => {
        console.log(error);
        this.errMsg = error.error.message;
      },
    });
  }
  ngOnInit() {}
}
