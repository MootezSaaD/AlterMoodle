import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateAssignmentElementComponent } from './late-assignment-element.component';

describe('LateAssignmentElementComponent', () => {
  let component: LateAssignmentElementComponent;
  let fixture: ComponentFixture<LateAssignmentElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateAssignmentElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateAssignmentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
