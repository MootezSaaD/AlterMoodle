import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialStatsComponent } from './initial-stats.component';

describe('InitialStatsComponent', () => {
  let component: InitialStatsComponent;
  let fixture: ComponentFixture<InitialStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
