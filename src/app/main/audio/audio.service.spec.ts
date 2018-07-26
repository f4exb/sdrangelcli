import { TestBed, inject } from '@angular/core/testing';

import { AudioService } from './audio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AUDIO_DEVICES_MOCK } from './audio';

describe('AudioService', () => {
  const sdrangelURL = 'http://127.0.0.1:8091/sdrangel/audio';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AudioService]
    });
  });

  it('should be created', inject([AudioService], (service: AudioService) => {
    expect(service).toBeTruthy();
  }));

  it('expects service to fetch audio information',
    inject([HttpTestingController, AudioService],
      (httpMock: HttpTestingController, service: AudioService) => {
        // We call the service
        service.getInfo(sdrangelURL).subscribe(data => {
          expect(data.nbInputDevices).toBe(10);
          expect(data.nbOutputDevices).toBe(20);
          expect(data.inputDevices[0].index).toBe(-1);
          expect(data.inputDevices[10].index).toBe(9);
          expect(data.outputDevices[0].index).toBe(-1);
          expect(data.outputDevices[20].index).toBe(19);
        });
        // We set the expectations for the HttpClient mock
        const req = httpMock.expectOne(req => req.method === 'GET' && req.url === sdrangelURL);
        // Then we set the fake data to be returned by the mock
        req.flush(AUDIO_DEVICES_MOCK);
  }));
});
