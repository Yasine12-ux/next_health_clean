import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuelleLineComponent } from './manuelle-line.component';

describe('ManuelleLineComponent', () => {
  let component: ManuelleLineComponent;
  let fixture: ComponentFixture<ManuelleLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManuelleLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManuelleLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
