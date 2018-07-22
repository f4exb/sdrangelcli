import { TestBed, inject } from '@angular/core/testing';

import { AddDevicesetService } from './add-deviceset.service';
import { HttpClientModule } from '@angular/common/http';

describe('AddDevicesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddDevicesetService],
      imports: [ HttpClientModule ]
    });
  });

  it('should be created', inject([AddDevicesetService], (service: AddDevicesetService) => {
    expect(service).toBeTruthy();
  }));
});
