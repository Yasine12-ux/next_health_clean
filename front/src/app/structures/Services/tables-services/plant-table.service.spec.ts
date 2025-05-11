import { TestBed } from '@angular/core/testing';

import { PlantTableService } from './plant-table.service';

describe('PlantTableService', () => {
  let service: PlantTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
