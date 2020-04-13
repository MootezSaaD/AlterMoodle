import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-enter-email",
  templateUrl: "./enter-email.component.html",
  styleUrls: ["./enter-email.component.css"]
})
export class EnterEmailComponent implements OnInit {
  emailModel = {
    email: ""
      };
  errorMessage: string;
  successMessage:String;
  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Enter Email");
  }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    
    this.auth.enteremail(form.value).subscribe(
      data => {
        this .successMessage = 'The reset link is in your email';
      },
      err => {
        this.errorMessage = err.error.message
      }
    );
    }
    }
