import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SideBarComponent } from "./side-bar/side-bar.component";
import { SignupComponent } from "./signup/signup.component";
import { JwtService } from "./services/jwt.service";
import { AuthService } from "./services/auth.service";
import { AssignmentService } from "./services/assignment.service";
import { StatisticsService } from "./services/statistics.service";
import { StorageService } from "./services/storage.service";
import { SubmissionService } from "./services/submission.service";
import { AuthGuardGuard as AuthGuard } from "./guards/auth-guard.guard";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserDdmenuComponent } from "./user-ddmenu/user-ddmenu.component";
import { UserScheduleComponent } from "./user-schedule/user-schedule.component";
import { InitialStatsComponent } from "./initial-stats/initial-stats.component";
import { MainDashboardComponent } from "./main-dashboard/main-dashboard.component";
import { StatsComponent } from "./stats/stats.component";
import { TodoComponent } from "./todo/todo.component";
import { CourseAssignmentsComponent } from "./course-assignments/course-assignments.component";
import { EditorComponent } from "./editor/editor.component";
import { EnterEmailComponent } from "./enter-email/enter-email.component";
import { EnterPasswordComponent } from "./enter-password/enter-password.component";
import { CourseProgressComponent } from "./statistics/course-progress/course-progress.component";
import { LoginLogsComponent } from "./statistics/login-logs/login-logs.component";
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationElementComponent } from './notification-element/notification-element.component';
import { LoadingComponent } from './loading/loading.component';
import { TimeSpentGraphComponent } from './time-spent-graph/time-spent-graph.component';
import { TotalAssignmentsComponent } from './total-assignments/total-assignments.component';
import { AverageTimeComponent } from './average-time/average-time.component';
import { LateAssignmentsComponent } from './late-assignments/late-assignments.component';
import { LateAssignmentElementComponent } from './late-assignment-element/late-assignment-element.component';
import { CourseGradesComponent } from './course-grades/course-grades.component';
import { CourseGradesElementComponent } from './course-grades-element/course-grades-element.component';
import { AvgTimeCourseComponent } from './avg-time-course/avg-time-course.component';

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
    MainDashboardComponent,
    StatsComponent,
    TodoComponent,
    CourseAssignmentsComponent,
    EditorComponent,
    EnterEmailComponent,
    EnterPasswordComponent,
    CourseProgressComponent,
    LoginLogsComponent,
    NotificationsComponent,
    NotificationElementComponent,
    LoadingComponent,
    TimeSpentGraphComponent,
    TotalAssignmentsComponent,
    AverageTimeComponent,
    LateAssignmentsComponent,
    LateAssignmentElementComponent,
    CourseGradesComponent,
    CourseGradesElementComponent,
    AvgTimeCourseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CKEditorModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RouterModule.forRoot([
      {
        path: "",
        component: LoginComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "profile",
            component: UserProfileComponent,
            canActivateChild: [AuthGuard],
          },
          {
            path: "editor",
            component: EditorComponent,
          },
          {
            path: "editor/:id",
            component: EditorComponent,
          },
          {
            path: "home",
            component: MainDashboardComponent,
            canActivateChild: [AuthGuard],
          },
          {
            path: "stats",
            component: StatsComponent,
            canActivateChild: [AuthGuard],
          },
          {
            path: "todo",
            component: TodoComponent,
            canActivateChild: [AuthGuard],
          },
          {
            path: "todo/:coursName",
            component: CourseAssignmentsComponent,
            canActivateChild: [AuthGuard],
          },
        ],
      },
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "signup",
        component: SignupComponent,
      },
      {
        path: "enter-email",
        component: EnterEmailComponent,
      },
      {
        path: "enter-password/:token",
        component: EnterPasswordComponent,
      },
    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthService,
    JwtService,
    AuthGuard,
    AssignmentService,
    StatisticsService,
    StorageService,
    SubmissionService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
