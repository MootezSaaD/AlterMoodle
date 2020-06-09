import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSpentGraphComponent } from './time-spent-graph.component';

describe('TimeSpentGraphComponent', () => {
  let component: TimeSpentGraphComponent;
  let fixture: ComponentFixture<TimeSpentGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSpentGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSpentGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
