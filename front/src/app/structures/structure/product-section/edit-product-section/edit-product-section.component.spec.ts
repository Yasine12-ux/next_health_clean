import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductSectionComponent } from './edit-product-section.component';

describe('EditProductSectionComponent', () => {
  let component: EditProductSectionComponent;
  let fixture: ComponentFixture<EditProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProductSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
