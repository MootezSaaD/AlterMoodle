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
  errMsg: string;
  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Enter Email");
  }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const resetPasswordObserver = ({
    next : x => console.log("email sent successfully"),
    error : error => console.log(error.error.message)
    });
    this.auth.enteremail(form.value).subscribe(resetPasswordObserver);
    }
    }
