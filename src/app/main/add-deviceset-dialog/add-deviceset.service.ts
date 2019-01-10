import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddDevicesetService {

  constructor(private http: HttpClient) {
  }

  add(url: string, isTx: boolean): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    const newurl = url + (isTx ? '?tx=1' : '?tx=0');
    return this.http.post(newurl, httpOptions);
  }
}
