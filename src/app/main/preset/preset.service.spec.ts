import { TestBed, inject } from '@angular/core/testing';

import { PresetService } from './preset.service';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PRESETS_MOCK } from './preset';

describe('PresetService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientTestingModule],
      providers: [PresetService]
    });
  });

  it('should be created', inject([PresetService], (service: PresetService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch preset information',
    inject([HttpTestingController, PresetService],
      (httpMock: HttpTestingController, service: PresetService) => {
        // We call the service
        service.getInfo(sdrangelURL).subscribe(data => {
          expect(data.nbGroups).toBe(3);
          expect(data.groups[0].groupName).toBe("10m");
          expect(data.groups[0].nbPresets).toBe(3);
          expect(data.groups[0].presets[0].centerFrequency).toBe(28480000);
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(req => req.method === 'GET' && req.url === sdrangelURL+'/presets');
        // Then we set the fake data to be returned by the mock
        req.flush(PRESETS_MOCK);
  }));
});
