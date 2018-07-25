import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from "rxjs/operators"

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  stop(url: string, devicesetIndex: number) : Observable<any> {
    // delay returned observable by 3s to leave time for the hardware to change state
    return this.http.delete(url + "/deviceset/" + devicesetIndex + "/device/run").pipe(delay(3000));
  }

  start(url: string, devicesetIndex: number) : Observable<any> {
    // delay returned observable by 3s to leave time for the hardware to change state
    return this.http.post(url + "/deviceset/" + devicesetIndex + "/device/run", null).pipe(delay(3000));
  }
}
