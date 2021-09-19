import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { FeatureDetailsService } from './feature-details.service';

describe('FeatureDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureDetailsService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([FeatureDetailsService], (service: FeatureDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
