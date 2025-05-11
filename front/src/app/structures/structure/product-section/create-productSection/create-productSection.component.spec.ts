import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductSectionComponent } from './create-productSection.component';

describe('UserDetailsComponent', () => {
  let component: CreateProductSectionComponent;
  let fixture: ComponentFixture<CreateProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProductSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
