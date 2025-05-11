import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManuelleSegmentComponent } from './create-manuelle-segment.component';

describe('CreateManuelleSegmentComponent', () => {
  let component: CreateManuelleSegmentComponent;
  let fixture: ComponentFixture<CreateManuelleSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateManuelleSegmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateManuelleSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
