import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MyLocation } from './location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }

  get(url: string): Observable<MyLocation> {
    return this.http.get<MyLocation>(url);
  }

  put(url: string, location: MyLocation): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.put(url, JSON.stringify(location), httpOptions);
  }
}
