import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';

import { InstanceSummaryService } from './instance-summary.service';

describe('InstanceSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientModule],
      providers: [InstanceSummaryService]
    });
  });

  it('should be created', inject([InstanceSummaryService], (service: InstanceSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
