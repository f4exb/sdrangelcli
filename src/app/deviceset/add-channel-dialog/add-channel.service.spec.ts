import { TestBed, inject } from '@angular/core/testing';

import { AddChannelService } from './add-channel.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AVAILABLE_CHANNELS_MOCK } from './channels';

describe('AddChannelService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddChannelService],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([AddChannelService], (service: AddChannelService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch available channels information',
    inject([HttpTestingController, AddChannelService],
      (httpMock: HttpTestingController, service: AddChannelService) => {
        // We call the service
        service.getAvailableChannels(sdrangelURL, false).subscribe(data => {
          expect(data.channelcount).toBe(7);
          expect(data.channels[0].id).toBe('AMDemod');
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(reqx => reqx.method === 'GET' && reqx.url === (sdrangelURL + '/channels?tx=0'));
        // Then we set the fake data to be returned by the mock
        req.flush(AVAILABLE_CHANNELS_MOCK);
  }));
});
