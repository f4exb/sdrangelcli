import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InstanceSummaryService } from './instance-summary.service';

const DATA = {
  appname: "SDRangel",
  architecture: "x86_64",
  devicesetlist: {
    deviceSets: [
      {
        channelcount: 0,
        samplingDevice: {
          bandwidth: 0,
          centerFrequency: 0,
          hwType: "FileSource",
          index: 0,
          nbStreams: 1,
          sequence: 0,
          state: "idle",
          streamIndex: 0,
          tx: 0
        }
      }
    ],
    devicesetcount: 1,
    devicesetfocus: 0
  },
  dspRxBits: 24,
  dspTxBits: 16,
  logging: {
    consoleLevel: "debug",
    dumpToFile: 0
  },
  os: "Ubuntu 18.04 LTS",
  pid: 8958,
  qtVersion: "5.9.5",
  version: "4.0.3"
};

describe('InstanceSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientTestingModule],
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
        service.getInfo().then(data => {
          expect(data.dspRxBits).toBe(24);
          expect(data.devicesetlist.devicesetcount).toBe(1);
          expect(data.devicesetlist.deviceSets.length).toBe(1);
          expect(data.devicesetlist.deviceSets[0].channelcount).toBe(0);
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(req => req.method === 'GET' && req.url === InstanceSummaryService.URL);
        // Then we set the fake data to be returned by the mock
        req.flush(DATA);
  }));  
});
