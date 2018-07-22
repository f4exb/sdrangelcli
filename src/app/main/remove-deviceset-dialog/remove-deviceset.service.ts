import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoveDevicesetService {

  constructor(private http: HttpClient) {
  }

  delete(url: string) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete(url, httpOptions);
    // this.http.delete(url, httpOptions).subscribe(
    //   res => {
    //     console.log("DELETE OK", url, res);
    //   },
    //   err => {
    //     console.log("DELETE Error", url, err);
    //   }
    // );
  }
}
