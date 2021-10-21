import { inject, TestBed } from '@angular/core/testing';

import { AddFeatureService } from './add-feature.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AVAILABLE_FEATURES_MOCK } from './features';

describe('AddFeatureService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddFeatureService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([AddFeatureService], (service: AddFeatureService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch available features information',
    inject([HttpTestingController, AddFeatureService],
      (httpMock: HttpTestingController, service: AddFeatureService) => {
        // We call the service
        service.getAvailableFeatures(sdrangelURL).subscribe(data => {
          expect(data.featurecount).toBe(6);
          expect(data.features[0].id).toBe('AFC');
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(reqx => reqx.method === 'GET' && reqx.url === (sdrangelURL + '/features'));
        // Then we set the fake data to be returned by the mock
        req.flush(AVAILABLE_FEATURES_MOCK);
  }));
});
