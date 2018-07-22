import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AudioDevices } from './audio';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private http: HttpClient) { }

  getInfo(url: string): Observable<AudioDevices> {
    return this.http.get<AudioDevices>(url);
  }
}
