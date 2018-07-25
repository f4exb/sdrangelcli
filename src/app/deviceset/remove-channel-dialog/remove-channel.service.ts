import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoveChannelService {

  constructor(private http: HttpClient) { 
  }

  removeChannel(url: string, deviceSetIndex: number, channelIndex: number) : Observable<any> {
    const newurl = url + '/deviceset/' + deviceSetIndex + '/channel/' + channelIndex;
    return this.http.delete(newurl);
  }  
}
