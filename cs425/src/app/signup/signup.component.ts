import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private titleService: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) {

    this.titleService.setTitle("Signup");
  }

  ngOnInit() {
  }

}
