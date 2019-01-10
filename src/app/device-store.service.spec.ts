import { TestBed, inject } from '@angular/core/testing';

import { DeviceStoreService, DeviceStorage } from './device-store.service';

describe('DeviceStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceStoreService]
    });
  });

  it('should be created', inject([DeviceStoreService], (service: DeviceStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should publish and subscribe', inject([DeviceStoreService], (service: DeviceStoreService) => {
    const deviceStorage0: DeviceStorage = {centerFrequency: 435000000, basebandRate: 64000};
    expect(service).toBeTruthy();
    service.change(0, deviceStorage0);
    service.get(0).subscribe(deviceStorage => { expect(deviceStorage).toBe(deviceStorage0); });
  }));

  it('should return error on wrong index', inject([DeviceStoreService], (service: DeviceStoreService) => {
    expect(service).toBeTruthy();
    service.get(1).subscribe(
      _ => {},
      error => { expect(error).toBe('No device at this index'); }
    );
  }));

});
