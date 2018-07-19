import { TestBed, inject } from '@angular/core/testing';

import { SdrangelUrlService } from './sdrangel-url.service';

describe('SdrangelUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SdrangelUrlService]
    });
  });

  it('should be created', inject([SdrangelUrlService], (service: SdrangelUrlService) => {
    expect(service).toBeTruthy();
  }));
});
