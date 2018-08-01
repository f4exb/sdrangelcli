import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AudioService } from './audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

export interface AudioStorage {
  audioRate: number;
}

interface AudioStore {
  [deviceName: string]: BehaviorSubject<AudioStorage>
}

@Injectable({
  providedIn: 'root'
})
export class AudioStoreService {
  private audioStore = <AudioStore>{}
  private initialized : boolean;
  sdrangelURL : string;

  constructor(private audioService : AudioService,
    private sdrangelUrlService : SdrangelUrlService) {
    this.initialized = false;
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    })
  }

  isInitialized() : boolean {
    return this.initialized;
  }

  initialize() {
    if (!this.initialized) {
      this.audioService.getInfo(this.sdrangelURL + "/audio").subscribe(
        audioDevicesInfo => {
          if (audioDevicesInfo.nbOutputDevices > 0) {
            for (let audioOutDevice of audioDevicesInfo.outputDevices) {
              this.change(audioOutDevice.name, {audioRate: audioOutDevice.sampleRate});
            }
          }
          this.initialized = true;
        },
      );
    }
  }

  change(deviceName: string, deviceStorage: AudioStorage) {
    if (deviceName in this.audioStore) {
      this.audioStore[deviceName].next(deviceStorage);
    } else {
      this.audioStore[deviceName] = new BehaviorSubject(deviceStorage);
    }
  }

  get(deviceName: string) : Observable<AudioStorage> {
    if (deviceName in this.audioStore) {
      return this.audioStore[deviceName].asObservable();
    } else {
      return throwError("No device with this name");
    }
  }
}
