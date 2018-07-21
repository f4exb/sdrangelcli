import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
