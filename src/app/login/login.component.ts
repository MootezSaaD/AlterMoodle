import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  userModel = {
    email: "",
    password: ""
  };
  userNotExists;
  userWrongPassword;
  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Login");
  }

  onSubmit(form: NgForm) {
    this.auth.login(form.value).subscribe({
      next: (data: any) => {
        this.router.navigateByUrl("/dashboard/home");
      },
      error: error => {
        console.log(error);
        if (error.error.error.includes("User")) {
          this.userNotExists = error.error.error;
        } else {
          this.userWrongPassword = error.error.error;
        }
      }
    });
  }
  ngOnInit() {}
}