import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InstanceSummaryService } from './instance-summary.service';
import { INSTANCE_SUMMARY_MOCK1 } from './instance-summary';

describe('InstanceSummaryService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstanceSummaryService]
    });
  });

  it('should be created', inject([InstanceSummaryService], (service: InstanceSummaryService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch instance summary information',
    inject([HttpTestingController, InstanceSummaryService],
      (httpMock: HttpTestingController, service: InstanceSummaryService) => {
        // We call the service
        service.getInfo(sdrangelURL).subscribe(data => {
          expect(data.dspRxBits).toBe(24);
          expect(data.devicesetlist.devicesetcount).toBe(1);
          expect(data.devicesetlist.deviceSets.length).toBe(1);
          expect(data.devicesetlist.deviceSets[0].channelcount).toBe(2);
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(req => req.method === 'GET' && req.url === sdrangelURL);
        // Then we set the fake data to be returned by the mock
        req.flush(INSTANCE_SUMMARY_MOCK1);
  }));
});
