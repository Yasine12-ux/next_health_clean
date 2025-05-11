import { TestBed } from '@angular/core/testing';

import { LineTableService } from './line-table.service';

describe('LineTableService', () => {
  let service: LineTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
