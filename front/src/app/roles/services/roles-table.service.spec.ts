import { TestBed } from '@angular/core/testing';

import { RolesTableService } from './roles-table.service';

describe('RolesTableService', () => {
  let service: RolesTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
