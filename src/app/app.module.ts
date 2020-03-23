import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SideBarComponent } from "./side-bar/side-bar.component";
import { SignupComponent } from "./signup/signup.component";
import { JwtService } from "./services/jwt.service";
import { AuthService } from "./services/auth.service";
import { AuthGuardGuard as AuthGuard } from "./guards/auth-guard.guard";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserDdmenuComponent } from "./user-ddmenu/user-ddmenu.component";
import { UserScheduleComponent } from "./user-schedule/user-schedule.component";
import { InitialStatsComponent } from "./initial-stats/initial-stats.component";
import { MainDashboardComponent } from "./main-dashboard/main-dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SideBarComponent,
    SignupComponent,
    UserProfileComponent,
    UserDdmenuComponent,
    UserScheduleComponent,
    InitialStatsComponent,
    MainDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: LoginComponent
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "profile",
            component: UserProfileComponent,
            canActivateChild: [AuthGuard]
          },
          {
            path: "home",
            component: MainDashboardComponent,
            canActivateChild: [AuthGuard]
          }
        ]
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "signup",
        component: SignupComponent
      }
    ])
  ],
  providers: [AuthService, JwtService],
  bootstrap: [AppComponent]
})
export class AppModule {}
