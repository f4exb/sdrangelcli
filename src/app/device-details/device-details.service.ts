import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceSettings } from './device-details';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetailsService {

  constructor(private http: HttpClient) { }

  getSettings(url: string, devicesetIndex: number): Observable<DeviceSettings> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/device/settings';
    return this.http.get<DeviceSettings>(newurl);
  }
}
