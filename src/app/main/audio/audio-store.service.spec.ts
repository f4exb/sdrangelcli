import { TestBed, inject } from '@angular/core/testing';

import { AudioStoreService, AudioStorage } from './audio-store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
    const audioStorage0 : AudioStorage = {audioRate: 48000};
    expect(service).toBeTruthy();
    service.change("test device", audioStorage0);
    service.get("test device").subscribe(audioStorage => {expect(audioStorage).toBe(audioStorage0)});
  }));

  it('should return error on wrong index', inject([AudioStoreService], (service: AudioStoreService) => {
    expect(service).toBeTruthy();
    service.get("kiki").subscribe(
      _ => {},
      error => {expect(error).toBe("No device with this name")}
    );
  }));
});
