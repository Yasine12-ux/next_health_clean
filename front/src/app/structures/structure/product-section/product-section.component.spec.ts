import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSectionComponent } from './product-section.component';

describe('PlantSectionComponent', () => {
  let component: ProductSectionComponent;
  let fixture: ComponentFixture<ProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
