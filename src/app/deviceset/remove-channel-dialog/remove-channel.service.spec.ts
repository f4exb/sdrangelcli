import { TestBed, inject } from '@angular/core/testing';

import { RemoveChannelService } from './remove-channel.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveChannelService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveChannelService],
      imports: [ HttpClientModule, HttpClientTestingModule ]
    });
  });

  it('should be created', inject([RemoveChannelService], (service: RemoveChannelService) => {
    expect(service).toBeTruthy();
  }));
});
