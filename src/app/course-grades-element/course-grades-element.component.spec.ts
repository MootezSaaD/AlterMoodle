import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseGradesElementComponent } from './course-grades-element.component';

describe('CourseGradesElementComponent', () => {
  let component: CourseGradesElementComponent;
  let fixture: ComponentFixture<CourseGradesElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseGradesElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseGradesElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
