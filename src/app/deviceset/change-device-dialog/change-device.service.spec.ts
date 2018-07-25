import { TestBed, inject } from '@angular/core/testing';

import { ChangeDeviceService } from './change-device.service';

describe('ChangeDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangeDeviceService]
    });
  });

  it('should be created', inject([ChangeDeviceService], (service: ChangeDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
