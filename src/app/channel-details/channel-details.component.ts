import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from './channel-details.service';
import { SdrangelUrlService } from '../sdrangel-url.service';

@Component({
  selector: 'app-channel-details',
  templateUrl: './channel-details.component.html',
  styleUrls: ['./channel-details.component.css']
})
export class ChannelDetailsComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  isTx: boolean;
  private sub: Subscription;
  sdrangelURL: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private sdrangelUrlService: SdrangelUrlService) {
      this.sub = null;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.deviceIndex = +params['dix']; // (+) converts string 'dix' to a number
      this.channelIndex = +params['cix']; // (+) converts string 'cix' to a number
    });
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getChannelSettings();
    });
  }

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        this.isTx = channelSettings.direction !== 0;
        if (channelSettings.channelType === 'ADSBDemod') {
          this.router.navigate(['adsbdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'AISDemod') {
          this.router.navigate(['aisdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'AISMod') {
          this.router.navigate(['aismod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'AMDemod') {
          this.router.navigate(['amdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'BFMDemod') {
          this.router.navigate(['bfmdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'ChirpChatDemod') {
          this.router.navigate(['chirpchatdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'ChirpChatMod') {
          this.router.navigate(['chirpchatmod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'FileSink') {
          this.router.navigate(['filesink'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'FileSource') {
          this.router.navigate(['filesource'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'SigMFFileSink') {
          this.router.navigate(['sigmffilesink'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'FreeDVDemod') {
          this.router.navigate(['freedvdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'FreqTracker') {
          this.router.navigate(['freqtracker'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'IEEE_802_15_4_Mod') {
          this.router.navigate(['ieee802154mod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'LocalSink') {
          this.router.navigate(['localsink'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'LocalSource') {
          this.router.navigate(['localsource'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'PacketDemod') {
          this.router.navigate(['packetdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'PacketMod') {
          this.router.navigate(['packetmod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'PagerDemod') {
          this.router.navigate(['pagerdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'RemoteSink') {
          this.router.navigate(['remotesink'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'RemoteSource') {
          this.router.navigate(['remotesource'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'DATVDemod') {
          this.router.navigate(['datvdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'DATVMod') {
          this.router.navigate(['datvmod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'DSDDemod') {
          this.router.navigate(['dsddemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'NFMDemod') {
          this.router.navigate(['nfmdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'SSBDemod') {
          this.router.navigate(['ssbdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'WFMDemod') {
          this.router.navigate(['wfmdemod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'AMMod') {
          this.router.navigate(['ammod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'FreeDVMod') {
          this.router.navigate(['freedvmod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'NFMMod') {
          this.router.navigate(['nfmmod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'SSBMod') {
          this.router.navigate(['ssbmod'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'UDPSource') {
          this.router.navigate(['udpsource'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'UDPSink') {
          this.router.navigate(['udpsink'], { relativeTo: this.route});
        } else if (channelSettings.channelType === 'WFMMod') {
          this.router.navigate(['wfmmod'], { relativeTo: this.route});
        } else {
          this.router.navigate(['notsupported'], { relativeTo: this.route});
        }
      }
    );
  }

  getDevicesetLabel(): string {
    return (this.isTx ? 'Tx' : 'Rx') + this.deviceIndex;
  }
}
