import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableDevices, NewDevice } from './devices';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChangeDeviceService {

  constructor(private http: HttpClient) { }

  getAvailableDevices(url: string, forTx: boolean): Observable<AvailableDevices> {
    const newurl = url + '/devices'+ (forTx ? "?tx=1" : "?tx=0");
    return this.http.get<AvailableDevices>(newurl);
  }

  changeDevice(url: string, deviceSetIndex: number, newDevice: NewDevice) : Observable<any> {
    const newurl = url + '/deviceset/' + deviceSetIndex + '/device';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.put(newurl, JSON.stringify(newDevice), httpOptions).pipe(delay(3000));
  }
}
