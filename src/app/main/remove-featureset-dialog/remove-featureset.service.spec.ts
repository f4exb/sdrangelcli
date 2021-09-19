import { TestBed, inject } from '@angular/core/testing';

import { RemoveFeaturesetService } from './remove-featureset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveFeaturesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveFeaturesetService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([RemoveFeaturesetService], (service: RemoveFeaturesetService) => {
    expect(service).toBeTruthy();
  }));
});
