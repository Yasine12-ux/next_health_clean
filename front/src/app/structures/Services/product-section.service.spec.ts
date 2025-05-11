import { TestBed } from '@angular/core/testing';

import { ProductSectionService } from './product-section.service';

describe('ProductSectionService', () => {
  let service: ProductSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
