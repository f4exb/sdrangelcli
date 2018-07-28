import { TestBed, inject } from '@angular/core/testing';

import { DeviceDetailsService } from './device-details.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DeviceDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceDetailsService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([DeviceDetailsService], (service: DeviceDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
