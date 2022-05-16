import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureSet } from './featureset';

@Injectable({
  providedIn: 'root'
})
export class FeaturesetService {

  constructor(private http: HttpClient) { }

  getInfo(url: string): Observable<FeatureSet> {
    const newurl = url + '/featureset';
    return this.http.get<FeatureSet>(newurl);
  }
}
