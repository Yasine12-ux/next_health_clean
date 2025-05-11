import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDashBoardComponent } from './appointment-dash-board.component';

describe('AppointmentDashBoardComponent', () => {
  let component: AppointmentDashBoardComponent;
  let fixture: ComponentFixture<AppointmentDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentDashBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
