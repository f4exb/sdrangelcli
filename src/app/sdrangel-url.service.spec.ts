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

  it('should publish and subscribe', inject([SdrangelUrlService], (service: SdrangelUrlService) => {
    expect(service).toBeTruthy();
    service.changeURL('http://test.com');
    service.currentUrlSource.subscribe(url => { expect(url).toBe('http://test.com'); });
  }));
});
