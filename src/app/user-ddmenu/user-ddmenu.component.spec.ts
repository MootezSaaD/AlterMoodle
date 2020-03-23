import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDdmenuComponent } from './user-ddmenu.component';

describe('UserDdmenuComponent', () => {
  let component: UserDdmenuComponent;
  let fixture: ComponentFixture<UserDdmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDdmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDdmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
