import { TestBed, inject } from '@angular/core/testing';

import { InstanceSummaryService } from './instance-summary.service';

describe('InstanceSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstanceSummaryService]
    });
  });

  it('should be created', inject([InstanceSummaryService], (service: InstanceSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
