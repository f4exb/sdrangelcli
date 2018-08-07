import { Component, OnInit } from '@angular/core';
import { AMModSettings, AMMOD_SETTINGS_DEFAULT } from './am-mod';
import { Subscription } from 'rxjs';
import { CWKeyerSettings } from '../cw-keyer/cw-keyer';
import { ChannelSettings } from '../channel-details';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { AudioDeviceInfo } from '../nfm-demod/nfm-demod.component';
import { Utils } from '../../common-components/utils';

interface AFInput {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-am-mod',
  templateUrl: './am-mod.component.html',
  styleUrls: ['./am-mod.component.css']
})
export class AmModComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: AMModSettings = AMMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  modulationPercent: number;
  afInputs: AFInput[] = [
    { value: 0, viewValue: "None" },
    { value: 1, viewValue: "Tone" },
    { value: 2, viewValue: "File" },
    { value: 3, viewValue: "Audio" },
    { value: 4, viewValue: "CW" },
  ];
  statusMessage: string;
  statusError: boolean = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr: string = 'rgb(0,0,0)'
  audioDevices: AudioDeviceInfo[] = [];
  monitor: boolean;
  channelMute: boolean;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService,
    private audioStoreService: AudioStoreService)
  {
    this.deviceStoreSubscription = null;
    this.channelReportSubscription = null;
    this.monitor = false;
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix']
    this.channelIndex = +this.route.snapshot.parent.params['cix']
    this.getDeviceStorage();
    this.getChannelSettings();
    this.getAudioDevicesInfo();
  }

  ngOnDestroy() {
    (this.deviceStoreSubscription) && this.deviceStoreSubscription.unsubscribe();
    (this.channelReportSubscription) && this.channelReportSubscription.unsubscribe();
  }

  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType == "AMMod") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.AMModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency)/1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate/2))/1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate/2))/1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth/1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.settings.volumeFactor = +this.settings.volumeFactor.toFixed(1);
          this.channelMute = this.settings.channelMute !== 0;
        } else {
          this.statusMessage = "Not an AMMod channel";
          this.statusError = true;
        }
      }
    )
  }

  getRGBTitleStr() : string {
    return "rgb(" + this.rgbTitle[0].toString() + "," + this.rgbTitle[1].toString() + "," + this.rgbTitle[2].toString() + ")";
  }

  private getDeviceStorage() {
    this.deviceStoreSubscription = this.deviceStoreService.get(this.deviceIndex).subscribe(
      deviceStorage => {
        this.deviceCenterFrequency = deviceStorage.centerFrequency;
        this.deviceBasebandRate = deviceStorage.basebandRate;
      },
      error => {
        if (error == "No device at this index") {
          this.deviceSetService.getInfo(this.sdrangelURL, this.deviceIndex).subscribe(
            deviceset => {
              this.deviceStoreService.change(
                this.deviceIndex,
                {
                  basebandRate: deviceset.samplingDevice.bandwidth,
                  centerFrequency: deviceset.samplingDevice.centerFrequency
                }
              )
              this.deviceBasebandRate = deviceset.samplingDevice.bandwidth;
              this.deviceCenterFrequency = deviceset.samplingDevice.centerFrequency;
            }
          )
        }
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

  private setDeviceSettings(amModSettings : AMModSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "AMMod";
    settings.tx = 1,
    settings.AMModSettings = amModSettings;
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

  onCWSettingsUpdate(cwSettings: CWKeyerSettings) {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.cwKeyer = cwSettings;
    this.setDeviceSettings(newSettings);
  }
}
