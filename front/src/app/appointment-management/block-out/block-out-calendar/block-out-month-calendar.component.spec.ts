import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockOutMonthCalendarComponent } from './block-out-month-calendar.component';

describe('BlockOutTableComponent', () => {
  let component: BlockOutMonthCalendarComponent;
  let fixture: ComponentFixture<BlockOutMonthCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockOutMonthCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockOutMonthCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
