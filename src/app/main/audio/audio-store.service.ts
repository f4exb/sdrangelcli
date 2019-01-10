import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AudioService } from './audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AudioOutputDevice, AudioInputDevice } from './audio';

export interface AudioStorage {
  audioRate: number;
}

interface AudioStore {
  [deviceName: string]: AudioStorage;
}

@Injectable({
  providedIn: 'root'
})
export class AudioStoreService {
  private audioOutStore = new BehaviorSubject(<AudioStore>{});
  private audioInStore = new BehaviorSubject(<AudioStore>{});
  private initialized: boolean;
  sdrangelURL: string;

  constructor(private audioService: AudioService,
    private sdrangelUrlService: SdrangelUrlService) {
    this.initialized = false;
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  initialize() {
    if (!this.initialized) {
      this.audioService.getInfo(this.sdrangelURL + '/audio').subscribe(
        audioDevicesInfo => {
          if (audioDevicesInfo.nbOutputDevices > 0) {
            this.changeOutput(audioDevicesInfo.outputDevices);
          }
          if (audioDevicesInfo.nbInputDevices > 0) {
            this.changeInput(audioDevicesInfo.inputDevices);
          }
          this.initialized = true;
        },
      );
    }
  }

  changeOutput(audioOutputDevices: AudioOutputDevice[]) {
    const audioStoreData = <AudioStore>{};
    for (const audioOutputDevice of audioOutputDevices) {
      audioStoreData[audioOutputDevice.name] = {audioRate: audioOutputDevice.sampleRate};
    }
    this.audioOutStore.next(Object.assign({}, audioStoreData));
  }

  changeInput(audioInputDevices: AudioInputDevice[]) {
    const audioStoreData = <AudioStore>{};
    for (const audioInputDevice of audioInputDevices) {
      audioStoreData[audioInputDevice.name] = {audioRate: audioInputDevice.sampleRate};
    }
    this.audioInStore.next(Object.assign({}, audioStoreData));
  }

  getOutput(): Observable<AudioStore> {
    return this.audioOutStore.asObservable();
  }

  getInput(): Observable<AudioStore> {
    return this.audioInStore.asObservable();
  }
}
