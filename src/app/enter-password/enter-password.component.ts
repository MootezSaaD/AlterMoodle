import { Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";


@Component({
    selector: "app-enter-password",
    templateUrl: "./enter-password.component.html",
    styleUrls: ["./enter-password.component.css"]
  })


  export class EnterPasswordComponent implements OnInit {
    ngOnInit() {}
    errorMessage: string;
    userStatus : String;
    token : null;
    passwordModel = {
      newPassword :''
    }

    constructor (
      private route :ActivatedRoute,
      private AuthService : AuthService,
      private router : Router
    ){
this.route.params.subscribe(
  params =>{
    this.token = params.token
  })}
  
    onSubmit (NgForm : NgForm){
        this.AuthService.enterPassword(this.token,NgForm.value).subscribe(
        data =>{
          this.router.navigateByUrl('/login');
        },
        err =>{
          //console.log(err);
          this.errorMessage = err.error.message
        }
        )
  }
}