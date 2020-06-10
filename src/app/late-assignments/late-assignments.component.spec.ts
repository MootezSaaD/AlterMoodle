import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateAssignmentsComponent } from './late-assignments.component';

describe('LateAssignmentsComponent', () => {
  let component: LateAssignmentsComponent;
  let fixture: ComponentFixture<LateAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
