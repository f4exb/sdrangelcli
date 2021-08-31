import { inject, TestBed } from '@angular/core/testing';

import { RemoveFeatureService } from './remove-feature.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveFeatureService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveFeatureService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([RemoveFeatureService], (service: RemoveFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
