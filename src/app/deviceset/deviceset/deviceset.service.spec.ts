import { TestBed, inject } from '@angular/core/testing';

import { DevicesetService } from './deviceset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DevicesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DevicesetService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([DevicesetService], (service: DevicesetService) => {
    expect(service).toBeTruthy();
  }));
});
