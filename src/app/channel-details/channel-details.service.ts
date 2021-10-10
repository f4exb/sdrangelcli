import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChannelSettings, ChannelReport, ChannelActions } from './channel-details';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelDetailsService {

  constructor(private http: HttpClient) { }

  getSettings(url: string, devicesetIndex: number, channelIndex: number): Observable<ChannelSettings> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/channel/' + channelIndex + '/settings';
    return this.http.get<ChannelSettings>(newurl);
  }

  setSettings(url: string, devicesetIndex: number, channelIndex: number, settings: ChannelSettings): Observable<any>  {
    const newurl = url + '/deviceset/' + devicesetIndex + '/channel/' + channelIndex + '/settings';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.patch(newurl, JSON.stringify(settings), httpOptions).pipe(delay(500));
  }

  getReport(url: string, devicesetIndex: number, channelIndex: number): Observable<ChannelReport> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/channel/' + channelIndex + '/report';
    return this.http.get<ChannelReport>(newurl);
  }

  postAction(url: string, devicesetIndex: number, channelIndex: number, actions: ChannelActions): Observable<any> {
    const newurl = url + '/deviceset/' + devicesetIndex + '/channel/' + channelIndex + '/actions';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(newurl, JSON.stringify(actions), httpOptions).pipe(delay(500));
  }
}
