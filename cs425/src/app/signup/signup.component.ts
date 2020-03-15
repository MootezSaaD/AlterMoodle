import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  userExists = "";

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.titleService.setTitle("Signup");
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$"),
          Validators.minLength(2),
          Validators.maxLength(255)
        ]
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$"),
          Validators.minLength(2),
          Validators.maxLength(255)
        ]
      ],
      moodleToken: [
        "",
        [Validators.required, Validators.min(1000000), Validators.max(9999999)]
      ],
      email: ["", [Validators.required, Validators.minLength(6)]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            "^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$"
          )
        ]
      ]
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl("/login");
      },
      error: error => {
        console.log(error);
        this.userExists = error.error.error;
        console.log(this.userExists);
        this.loading = false;
      }
    });
  }
}
