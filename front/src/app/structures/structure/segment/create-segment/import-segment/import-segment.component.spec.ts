import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSegmentComponent } from './import-segment.component';

describe('ImportSegmentComponent', () => {
  let component: ImportSegmentComponent;
  let fixture: ComponentFixture<ImportSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportSegmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
