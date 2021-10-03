import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceSet, DeviceSets } from './deviceset';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesetService {

  constructor(private http: HttpClient) { }

  getInfo(url: string, devicesetIndex: number): Observable<DeviceSet> {
    const newurl = url + '/deviceset/' + devicesetIndex;
    return this.http.get<DeviceSet>(newurl);
  }

  getDevicesets(url: string): Observable<DeviceSets> {
    const newurl = url + '/devicesets';
    return this.http.get<DeviceSets>(newurl);
  }
}
