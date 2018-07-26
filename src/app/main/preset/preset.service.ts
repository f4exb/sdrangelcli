import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Presets, PresetLoad } from './preset';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresetService {

  constructor(private http: HttpClient) { }

  getInfo(url: string): Observable<Presets> {
    return this.http.get<Presets>(url + '/presets');
  }

  loadPreset(url: string, preset: PresetLoad) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(url + '/preset', JSON.stringify(preset), httpOptions).pipe(delay(500));
  }

  savePreset(url: string, preset: PresetLoad) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.put(url + '/preset', JSON.stringify(preset), httpOptions);
  }

  newPreset(url: string, preset: PresetLoad) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(url + '/preset', JSON.stringify(preset), httpOptions);
  }
}
