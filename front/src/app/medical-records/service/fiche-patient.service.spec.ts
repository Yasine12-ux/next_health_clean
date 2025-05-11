import { TestBed } from '@angular/core/testing';

import { FichePatientService } from './fiche-patient.service';

describe('FichePatientService', () => {
  let service: FichePatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichePatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
