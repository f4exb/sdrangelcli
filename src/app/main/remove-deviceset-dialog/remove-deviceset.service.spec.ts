import { TestBed, inject } from '@angular/core/testing';

import { RemoveDevicesetService } from './remove-deviceset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveDevicesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveDevicesetService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([RemoveDevicesetService], (service: RemoveDevicesetService) => {
    expect(service).toBeTruthy();
  }));
});
