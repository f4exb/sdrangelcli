import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvailableFeatures, NewFeature } from './features';

@Injectable({
  providedIn: 'root'
})
export class AddFeatureService {

  constructor(private http: HttpClient) {
  }

  getAvailableFeatures(url: string): Observable<AvailableFeatures> {
    const newurl = url + '/features';
    return this.http.get<AvailableFeatures>(newurl);
  }

  addFeature(url: string, featureSetIndex: number, featureId: string): Observable<any> {
    const newFeature = <NewFeature>{};
    newFeature.featureType = featureId;
    const newurl = url + '/featureset/' + featureSetIndex + '/feature';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(newurl, JSON.stringify(newFeature), httpOptions);
  }
}
