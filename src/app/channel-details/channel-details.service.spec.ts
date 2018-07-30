import { TestBed, inject } from '@angular/core/testing';

import { ChannelDetailsService } from './channel-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChannelDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelDetailsService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([ChannelDetailsService], (service: ChannelDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
