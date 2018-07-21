import { TestBed, inject } from '@angular/core/testing';

import { LoggingService } from './logging.service';
import { HttpClientModule } from '@angular/common/http';

describe('LoggingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ LoggingService ],
      imports: [ HttpClientModule ]
    });
  });

  it('should be created', inject([LoggingService], (service: LoggingService) => {
    expect(service).toBeTruthy();
  }));
});
