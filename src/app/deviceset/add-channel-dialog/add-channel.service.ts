import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AvailableChannels, NewChannel } from './channels';

@Injectable({
  providedIn: 'root'
})
export class AddChannelService {

  constructor(private http: HttpClient) {
  }

  getAvailableChannels(url: string, forTx: boolean): Observable<AvailableChannels> {
    const newurl = url + '/channels' + (forTx ? '?direction=1' : '?direction=0');
    return this.http.get<AvailableChannels>(newurl);
  }

  addChannel(url: string, deviceSetIndex: number, isTx: boolean, channelId: string): Observable<any> {
    const newChannel = <NewChannel>{};
    newChannel.channelType = channelId;
    newChannel.direction = isTx ? 1 : 0;
    const newurl = url + '/deviceset/' + deviceSetIndex + '/channel';
    const httpOptions = {
      headers: new HttpHeaders({
        'accept':  'application/json',
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(newurl, JSON.stringify(newChannel), httpOptions);
  }
}
