import { TestBed, inject } from '@angular/core/testing';

import { ChangeDeviceService } from './change-device.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AVAILABLE_DEVICES_MOCK } from './devices';

describe('ChangeDeviceService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangeDeviceService],
      imports: [ HttpClientModule, HttpClientTestingModule ]
    });
  });

  it('should be created', inject([ChangeDeviceService], (service: ChangeDeviceService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch available devices information',
    inject([HttpTestingController, ChangeDeviceService],
      (httpMock: HttpTestingController, service: ChangeDeviceService) => {
        // We call the service
        service.getAvailableDevices(sdrangelURL, false).subscribe(data => {
          expect(data.devicecount).toBe(7);
          expect(data.devices[0].hwType).toBe("AirspyHF");
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(req => req.method === 'GET' && req.url === (sdrangelURL+ "/devices?tx=0"));
        // Then we set the fake data to be returned by the mock
        req.flush(AVAILABLE_DEVICES_MOCK);
  }));  
});
