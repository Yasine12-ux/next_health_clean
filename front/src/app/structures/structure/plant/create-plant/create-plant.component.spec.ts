import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantComponent } from './create-plant.component';

describe('UserDetailsComponent', () => {
  let component: CreatePlantComponent;
  let fixture: ComponentFixture<CreatePlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePlantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
