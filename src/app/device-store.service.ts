import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { throwError } from 'rxjs';

// This service allows sharing some essential device data

export interface DeviceStorage {
  centerFrequency: number;
  basebandRate: number;
}

interface DeviceStore {
  [deviceIndex: number]: BehaviorSubject<DeviceStorage>
}

@Injectable({
  providedIn: 'root'
})
export class DeviceStoreService {
  private deviceStore = <DeviceStore>{}

  constructor() { }

  change(deviceIndex: number, deviceStorage: DeviceStorage) {
    if (deviceIndex in this.deviceStore) {
      this.deviceStore[deviceIndex].next(deviceStorage);
    } else {
      this.deviceStore[deviceIndex] = new BehaviorSubject(deviceStorage);
    }
  }

  get(deviceIndex: number) : Observable<DeviceStorage> {
    if (deviceIndex in this.deviceStore) {
      return this.deviceStore[deviceIndex].asObservable();
    } else {
      return throwError("No device at this index");
    }
  }
}
