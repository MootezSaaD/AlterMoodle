import { Component } from '@angular/core';

@Component({
  selector : 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  userInput = '';
  loginAttempt = '';
  onLogin() {
    this.loginAttempt = this.userInput;
  }
}
