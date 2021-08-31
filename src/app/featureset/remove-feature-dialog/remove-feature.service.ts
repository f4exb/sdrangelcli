import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoveFeatureService {

  constructor(private http: HttpClient) {
  }

  removeChannel(url: string, featureSetIndex: number, featureIndex: number): Observable<any> {
    const newurl = url + '/featureset/' + featureSetIndex + '/feature/' + featureIndex;
    return this.http.delete(newurl);
  }
}
