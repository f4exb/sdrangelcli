import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FEATURE_PRESETS_MOCK } from './featurepreset';

import { FeaturepresetService } from './featurepreset.service';

describe('FeaturepresetService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeaturepresetService]
    });
  });

  it('should be created', inject([FeaturepresetService], (service: FeaturepresetService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch feature preset information',
    inject([HttpTestingController, FeaturepresetService],
      (httpMock: HttpTestingController, service: FeaturepresetService) => {
        // We call the service
        service.getInfo(sdrangelURL).subscribe(data => {
          expect(data.nbGroups).toBe(3);
          expect(data.groups[0].groupName).toBe('Maps');
          expect(data.groups[0].nbPresets).toBe(2);
          expect(data.groups[0].presets[0].description).toBe('AIS');
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(reqx => reqx.method === 'GET' && reqx.url === sdrangelURL + '/featurepresets');
        // Then we set the fake data to be returned by the mock
        req.flush(FEATURE_PRESETS_MOCK);
  }));
});
