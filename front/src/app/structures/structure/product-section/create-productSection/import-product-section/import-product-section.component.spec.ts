import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProductSectionComponent } from './import-product-section.component';

describe('ImportProductSectionComponent', () => {
  let component: ImportProductSectionComponent;
  let fixture: ComponentFixture<ImportProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportProductSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
