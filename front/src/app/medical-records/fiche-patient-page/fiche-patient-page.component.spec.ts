import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePatientPageComponent } from './fiche-patient-page.component';

describe('FichePatientPageComponent', () => {
  let component: FichePatientPageComponent;
  let fixture: ComponentFixture<FichePatientPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FichePatientPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichePatientPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
