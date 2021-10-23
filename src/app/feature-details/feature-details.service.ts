import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FeatureActions, FeatureReport, FeatureSettings } from './feature-details';

@Injectable({
  providedIn: 'root'
})
export class FeatureDetailsService {

  constructor(private http: HttpClient) { }

  getSettings(url: string, featuresetIndex: number, featureIndex: number): Observable<FeatureSettings> {
    const newurl = url + '/featureset/' + featuresetIndex + '/feature/' + featureIndex + '/settings';
    return this.http.get<FeatureSettings>(newurl);
  }

  setSettings(url: string, featuresetIndex: number, featureIndex: number, settings: FeatureSettings): Observable<any>  {
    const newurl = url + '/featureset/' + featuresetIndex + '/feature/' + featureIndex + '/settings';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(newurl, JSON.stringify(settings), httpOptions).pipe(delay(500));
  }

  getReport(url: string, featuresetIndex: number, featureIndex: number): Observable<FeatureReport> {
    const newurl = url + '/featureset/' + featuresetIndex + '/feature/' + featureIndex + '/report';
    return this.http.get<FeatureReport>(newurl);
  }

  postAction(url: string, featuresetIndex: number, featureIndex: number, actions: FeatureActions): Observable<any> {
    const newurl = url + '/featureset/' + featuresetIndex + '/feature/' + featureIndex + '/actions';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(newurl, JSON.stringify(actions), httpOptions).pipe(delay(500));
  }
}
