import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logging } from './logging';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private http: HttpClient) {
  }

  get(url: string): Observable<Logging> {
    return this.http.get<Logging>(url);
  }

  put(url: string, logging: Logging) {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    this.http.put(url, JSON.stringify(logging), httpOptions).subscribe(
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
