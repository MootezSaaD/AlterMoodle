import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgTimeCourseComponent } from './avg-time-course.component';

describe('AvgTimeCourseComponent', () => {
  let component: AvgTimeCourseComponent;
  let fixture: ComponentFixture<AvgTimeCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgTimeCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgTimeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
