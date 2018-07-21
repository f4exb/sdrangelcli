import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }

  get(url: string): Observable<Location> {
    return this.http.get<Location>(url);
  }

  put(url: string, location: Location) {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    this.http.put(url, JSON.stringify(location), httpOptions).subscribe(
      res => {
        console.log("PUT OK", url, res);
      },
      err => {
        console.log("PUT Error", url, err);
      },
      () => {
        console.log("PUT completed", url);
      }
    );
  }
}
