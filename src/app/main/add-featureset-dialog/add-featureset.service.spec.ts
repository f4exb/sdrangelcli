import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddFeaturesetService } from './add-fatureset.service';

describe('AddFeaturesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddFeaturesetService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([AddFeaturesetService], (service: AddFeaturesetService) => {
    expect(service).toBeTruthy();
  }));
});
