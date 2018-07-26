import { TestBed, inject } from '@angular/core/testing';

import { AddDevicesetService } from './add-deviceset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddDevicesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddDevicesetService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([AddDevicesetService], (service: AddDevicesetService) => {
    expect(service).toBeTruthy();
  }));
});
