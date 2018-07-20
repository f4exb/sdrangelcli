import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

import {InstanceSummary} from '../instance-summary/instance-summary';

@Injectable({
  providedIn: 'root'
})
export class InstanceSummaryService {

  constructor(private http: HttpClient) {
  }

  getInfo(url: string): Observable<InstanceSummary> {
    return this.http.get<InstanceSummary>(url);
  }
}
