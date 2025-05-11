import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSectionTableComponent } from './product-section-table.component';

describe('TableComponent', () => {
  let component: ProductSectionTableComponent;
  let fixture: ComponentFixture<ProductSectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSectionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
