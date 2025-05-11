import { TestBed } from '@angular/core/testing';

import { AppointmentManagementTableService } from './appointment-management-table.service';

describe('AppointmentManagementTableService', () => {
  let service: AppointmentManagementTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentManagementTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
