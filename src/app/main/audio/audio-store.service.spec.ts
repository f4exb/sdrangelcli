import { TestBed, inject } from '@angular/core/testing';

import { AudioStoreService, AudioStorage } from './audio-store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AUDIO_DEVICES_MOCK, AudioOutputDevice } from './audio';

describe('AudioStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioStoreService],
      imports: [ HttpClientTestingModule]
    });
  });

  it('should be created', inject([AudioStoreService], (service: AudioStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should publish and subscribe', inject([AudioStoreService], (service: AudioStoreService) => {
    const audioOutputDevices : AudioOutputDevice[] = AUDIO_DEVICES_MOCK.outputDevices;
    service.changeOutput(audioOutputDevices);
    service.getOutput().subscribe(audioStorage => {expect(audioStorage["System default device"]["audioRate"]).toBe(48000)});
  }));
});
