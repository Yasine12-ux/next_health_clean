import { TestBed } from '@angular/core/testing';

import { BlockOutService } from './block-out.service';

describe('BlockOutService', () => {
  let service: BlockOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
