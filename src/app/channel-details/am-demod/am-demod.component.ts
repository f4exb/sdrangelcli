import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Subscription } from 'rxjs';
import { AMDemodSettings } from './am-demod';

@Component({
  selector: 'app-am-demod',
  templateUrl: './am-demod.component.html',
  styleUrls: ['./am-demod.component.css']
})
export class AmDemodComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: AMDemodSettings;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequency: number;
  channelMinFrequency: number;
  channelMaxFrequency: number;
  statusMessage: string;
  statusError: boolean = false;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService)
  {
    this.deviceStoreSubscription = null;
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix']
    this.channelIndex = +this.route.snapshot.parent.params['cix']
    this.getDeviceStorage();
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });    
    this.getChannelSettings();
  }

  ngOnDestroy() {
    (this.deviceStoreSubscription) && this.deviceStoreSubscription.unsubscribe();
  }


  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType == "AMDemod") {
          this.statusMessage = "OK";
          this.statusError = false;
          console.log(channelSettings);
          this.settings = channelSettings.AMDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequency = this.deviceCenterFrequency + this.channelDeltaFrequency;
          this.channelMaxFrequency = this.deviceCenterFrequency + (this.deviceBasebandRate/2);
          this.channelMinFrequency = this.deviceCenterFrequency - (this.deviceBasebandRate/2);
        } else {
          this.statusMessage = "Not an AMDemod channel";
          this.statusError = true;
        }
      }
    )
  }

  private getDeviceStorage() {
    this.deviceStoreSubscription = this.deviceStoreService.get(this.deviceIndex).subscribe(
      deviceStorage => {
        this.deviceCenterFrequency = deviceStorage.centerFrequency;
        this.deviceBasebandRate = deviceStorage.basebandRate;
        console.log(this.deviceCenterFrequency, this.deviceBasebandRate);
      }
    )
  }

  onFrequencyUpdate(frequency: number) {
    console.log("onFrequencyUpdate", this.channelCenterFrequency, frequency);
    this.channelCenterFrequency = frequency;
  }

}
