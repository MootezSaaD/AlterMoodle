import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAssignmentsComponent } from './total-assignments.component';

describe('TotalAssignmentsComponent', () => {
  let component: TotalAssignmentsComponent;
  let fixture: ComponentFixture<TotalAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
