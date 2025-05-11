import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePatientTableComponent } from './fiche-patient-table.component';

describe('FichePatientTableComponent', () => {
  let component: FichePatientTableComponent;
  let fixture: ComponentFixture<FichePatientTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FichePatientTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichePatientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
