import { Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";

@Component({
    selector: "app-enter-password",
    templateUrl: "./enter-password.component.html",
    styleUrls: ["./enter-password.component.css"]
  })


  export class EnterPasswordComponent implements OnInit {
    ngOnInit() {}
    userStatus : String;
    token : null;
    passwordModel = {
      password :''
    }
    constructor (
      private route :ActivatedRoute,
      private AuthService : AuthService,
    ){
this.route.params.subscribe(
  params =>{
    this.token = params.token
  }
)    }
  
    onSubmit (NgForm : NgForm){
      this.AuthService.enterPassword(this.token,NgForm.value).subscribe(
      data =>{
      },
      err =>{
        console.log (err.error.message)
      }
      )
    

  }
}