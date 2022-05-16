import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoveFeatureService {

  constructor(private http: HttpClient) {
  }

  removeFeature(url: string, featureIndex: number): Observable<any> {
    const newurl = url + '/featureset/feature/' + featureIndex;
    return this.http.delete(newurl);
  }
}
