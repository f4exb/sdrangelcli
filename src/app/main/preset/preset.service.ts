import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Presets, PresetLoad, PresetExport, PresetDelete, PresetImport } from './preset';
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

  loadPreset(url: string, preset: PresetLoad): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(url + '/preset', JSON.stringify(preset), httpOptions).pipe(delay(500));
  }

  savePreset(url: string, preset: PresetLoad): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.put(url + '/preset', JSON.stringify(preset), httpOptions);
  }

  newPreset(url: string, preset: PresetLoad): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(url + '/preset', JSON.stringify(preset), httpOptions);
  }

  removePreset(url: string, preset: PresetDelete): Observable<any> {
    const httpOptions = {
      body:  JSON.stringify(preset),
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete(url + '/preset', httpOptions);
  }

  exportPreset(url: string, preset: PresetExport): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(url + '/preset/file', JSON.stringify(preset), httpOptions);
  }

  importPreset(url: string, preset: PresetImport): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.put(url + '/preset/file', JSON.stringify(preset), httpOptions);
  }
}
