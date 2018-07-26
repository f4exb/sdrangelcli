import { TestBed, inject } from '@angular/core/testing';

import { RemoveChannelService } from './remove-channel.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveChannelService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveChannelService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([RemoveChannelService], (service: RemoveChannelService) => {
    expect(service).toBeTruthy();
  }));
});
