import { TestBed } from '@angular/core/testing';

import { TestCasesService } from './test-cases.service';

describe('TestCasesService', () => {
  let service: TestCasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestCasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
