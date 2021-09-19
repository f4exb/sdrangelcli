import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FeaturePresetIdentifier, FeaturePresets } from './featurepreset';

@Injectable({
  providedIn: 'root'
})
export class FeaturepresetService {

  constructor(private http: HttpClient) { }

  getInfo(url: string): Observable<FeaturePresets> {
    return this.http.get<FeaturePresets>(url + '/featurepresets');
  }

  removePreset(url: string, preset: FeaturePresetIdentifier): Observable<any> {
    const httpOptions = {
      body:  JSON.stringify(preset),
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete(url + '/featurepreset', httpOptions);
  }

  savePreset(url: string, featuresetIndex: number, preset: FeaturePresetIdentifier): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.put(url + '/featureset/' + featuresetIndex + '/preset', JSON.stringify(preset), httpOptions);
  }

  loadPreset(url: string, featuresetIndex: number, preset: FeaturePresetIdentifier): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(url + '/featureset/' + featuresetIndex + '/preset', JSON.stringify(preset), httpOptions).pipe(delay(500));
  }

  newPreset(url: string, featuresetIndex: number, preset: FeaturePresetIdentifier): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(url + '/featureset/' + featuresetIndex + '/preset', JSON.stringify(preset), httpOptions);
  }
}
