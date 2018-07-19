import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SdrangelUrlService {

  private urlSource = new BehaviorSubject('http://127.0.0.1:8091/sdrangel');
  currentUrlSource = this.urlSource.asObservable();

  constructor() { }

  changeURL(url: string) {
    this.urlSource.next(url);
  }
}
