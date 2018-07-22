import { TestBed, inject } from '@angular/core/testing';

import { RemoveDevicesetService } from './remove-deviceset.service';
import { HttpClientModule } from '@angular/common/http';

describe('RemoveDevicesetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveDevicesetService],
      imports: [ HttpClientModule ]
    });
  });

  it('should be created', inject([RemoveDevicesetService], (service: RemoveDevicesetService) => {
    expect(service).toBeTruthy();
  }));
});
