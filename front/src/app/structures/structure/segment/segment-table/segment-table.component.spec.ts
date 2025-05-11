import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentTableComponent } from './segment-table.component';

describe('TableComponent', () => {
  let component: SegmentTableComponent;
  let fixture: ComponentFixture<SegmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
