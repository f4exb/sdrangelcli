import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-am-demod',
  templateUrl: './am-demod.component.html',
  styleUrls: ['./am-demod.component.css']
})
export class AmDemodComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;

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
    console.log(this.deviceIndex, this.channelIndex);
    this.getDeviceStorage();
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

  ngOnDestroy() {
    (this.deviceStoreSubscription) && this.deviceStoreSubscription.unsubscribe();
  }

}
