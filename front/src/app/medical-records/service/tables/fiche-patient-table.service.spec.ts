import { TestBed } from '@angular/core/testing';

import { FichePatientTableService } from './fiche-patient-table.service';

describe('FichePatientTableService', () => {
  let service: FichePatientTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichePatientTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
