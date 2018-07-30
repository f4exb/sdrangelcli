import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChannelSettings } from './channel-details';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelDetailsService {

  constructor(private http: HttpClient) { }

  getSettings(url: string, devicesetIndex: number, channelIndex: number): Observable<ChannelSettings> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/channel/' + channelIndex + '/settings';
    return this.http.get<ChannelSettings>(newurl);
  }  
}
