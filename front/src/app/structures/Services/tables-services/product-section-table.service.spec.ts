import { TestBed } from '@angular/core/testing';

import { ProductSectionTableService } from './product-section-table.service';

describe('ProductSectionTableService', () => {
  let service: ProductSectionTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSectionTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
