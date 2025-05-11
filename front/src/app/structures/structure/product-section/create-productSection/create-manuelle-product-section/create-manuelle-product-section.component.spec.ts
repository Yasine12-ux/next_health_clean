import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManuelleProductSectionComponent } from './create-manuelle-product-section.component';

describe('CreateManuelleProductSectionComponent', () => {
  let component: CreateManuelleProductSectionComponent;
  let fixture: ComponentFixture<CreateManuelleProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateManuelleProductSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateManuelleProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
