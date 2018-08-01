import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Subscription } from 'rxjs';
import { AMDemodSettings, AMDEMOD_SETTINGS_DEFAULT } from './am-demod';
import { ChannelSettings } from '../channel-details';
import { Utils } from '../../common-components/utils';
import { AudioStoreService } from '../../main/audio/audio-store.service';

export interface AudioDeviceInfo {
  value: string,
  viewValue: number
}

@Component({
  selector: 'app-am-demod',
  templateUrl: './am-demod.component.html',
  styleUrls: ['./am-demod.component.css']
})
export class AmDemodComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: AMDemodSettings = AMDEMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  statusMessage: string;
  statusError: boolean = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr: string = 'rgb(0,0,0)'
  audioDevices: AudioDeviceInfo[] = [];

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService,
    private audioStoreService: AudioStoreService)
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
    this.getAudioDevicesInfo();
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
          this.settings = channelSettings.AMDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency)/1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate/2))/1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate/2))/1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
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
      }
    )
  }

  private getAudioDevicesInfo() {
    if (!this.audioStoreService.isInitialized()) {
      this.audioStoreService.initialize();
    }
    this.audioStoreService.getOutput().subscribe(
      audioData => {
        this.audioDevices = [];
        for (let [key, value] of Object.entries(audioData)) {
          this.audioDevices.push({value: key, viewValue: value["audioRate"]});
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  private setDeviceSettings(amDemodSettings : AMDemodSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "AMDemod";
    settings.tx = 0,
    settings.AMDemodSettings = amDemodSettings;
    this.channeldetailsService.setSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex, settings).subscribe(
      res => {
        console.log("Set settings OK", res);
        this.statusMessage = "OK";
        this.statusError = false;
        this.getChannelSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    )
  }

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: AMDemodSettings = <AMDemodSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getRGBTitleStr() : string {
    return "rgb(" + this.rgbTitle[0].toString() + "," + this.rgbTitle[1].toString() + "," + this.rgbTitle[2].toString() + ")";
  }

  setTitleColor() {
    const newSettings: AMDemodSettings = <AMDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  setTitle() {
    const newSettings: AMDemodSettings = <AMDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setAudioDevice() {
    const newSettings: AMDemodSettings = <AMDemodSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setDeviceSettings(newSettings);
  }
}
