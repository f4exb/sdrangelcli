import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddFeaturesetService {

  constructor(private http: HttpClient) {
  }

  add(url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    const newurl = url;
    return this.http.post(newurl, httpOptions);
  }
}
