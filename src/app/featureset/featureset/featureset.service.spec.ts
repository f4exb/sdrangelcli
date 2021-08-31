import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { FeaturesetService } from './featureset.service';

describe('FeaturesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeaturesetService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([FeaturesetService], (service: FeaturesetService) => {
    expect(service).toBeTruthy();
  }));
});
