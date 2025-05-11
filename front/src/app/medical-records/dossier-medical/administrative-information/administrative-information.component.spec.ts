import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeInformationComponent } from './administrative-information.component';

describe('FichePatientComponent', () => {
  let component: AdministrativeInformationComponent;
  let fixture: ComponentFixture<AdministrativeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrativeInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrativeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
