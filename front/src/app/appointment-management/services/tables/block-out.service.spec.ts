import { TestBed } from '@angular/core/testing';

import { BlockOutTableService } from './block-out-table.service';

describe('BlockOutService', () => {
  let service: BlockOutTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockOutTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
