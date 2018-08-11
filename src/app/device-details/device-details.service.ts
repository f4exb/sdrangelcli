import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceSettings, DeviceReport } from './device-details';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetailsService {

  constructor(private http: HttpClient) { }

  getSettings(url: string, devicesetIndex: number): Observable<DeviceSettings> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/device/settings';
    return this.http.get<DeviceSettings>(newurl);
  }

  setSettings(url: string, devicesetIndex: number, settings: DeviceSettings) : Observable<any>  {
    const newurl = url + '/deviceset/' + devicesetIndex + '/device/settings';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(newurl, JSON.stringify(settings), httpOptions).pipe(delay(500));
  }

  getReport(url: string, devicesetIndex: number): Observable<DeviceReport> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/device/report';
    return this.http.get<DeviceReport>(newurl);
  }
}
