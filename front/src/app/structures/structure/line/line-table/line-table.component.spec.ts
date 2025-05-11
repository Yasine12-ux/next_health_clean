import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineTableComponent } from './line-table.component';

describe('TableComponent', () => {
  let component: LineTableComponent;
  let fixture: ComponentFixture<LineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
