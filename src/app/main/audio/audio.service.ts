import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AudioDevices, AudioOutputDevice } from './audio';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private http: HttpClient) { }

  getInfo(url: string): Observable<AudioDevices> {
    return this.http.get<AudioDevices>(url);
  }

  updateAudioOupout(url: string, audioDevice: AudioOutputDevice) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(url, JSON.stringify(location), httpOptions);
  }  
}
