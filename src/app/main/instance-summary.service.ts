import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {InstanceSummary} from './instance-summary/instance-summary';

//const URL = 'http://127.0.0.1:8091/sdrangel'; // make it a constant for now

@Injectable({
  providedIn: 'root'
})
export class InstanceSummaryService {

  public static readonly URL = 'http://127.0.0.1:8091/sdrangel'; // make it a constant for now

  constructor(private http: HttpClient) {
  }

  getInfo(): Promise<InstanceSummary> {
    return this.http.get<InstanceSummary>(InstanceSummaryService.URL).toPromise();
  }

  // getInfo(): Observable<InstanceSummary> {
  //   return this.http.get<InstanceSummary>(`${URL}`);
  // }
}
