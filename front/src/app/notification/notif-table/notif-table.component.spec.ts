import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifTableComponent } from './notif-table.component';

describe('NotifTableComponent', () => {
  let component: NotifTableComponent;
  let fixture: ComponentFixture<NotifTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotifTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
