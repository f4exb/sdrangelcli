import { TestBed, inject } from '@angular/core/testing';

import { DeviceService } from './device.service';
import { HttpClientModule } from '@angular/common/http';

describe('DeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService],
      imports: [ HttpClientModule ]
    });
  });

  it('should be created', inject([DeviceService], (service: DeviceService) => {
    expect(service).toBeTruthy();
  }));
});
