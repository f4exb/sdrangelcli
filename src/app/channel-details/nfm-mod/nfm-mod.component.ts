import { Component, OnInit } from '@angular/core';
import { NFMModSettings, NFMMOD_SETTINGS_DEFAULT, NFMModReport, NFMMOD_REPORT_DEFAULT } from './nfm-mod';
import { Subscription, interval } from 'rxjs';
import { AudioDeviceInfo } from '../am-demod/am-demod.component';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';
import { CWKeyerSettings } from '../cw-keyer/cw-keyer';

interface AFInput {
  value: number,
  viewValue: string
}

interface RFBandwidth {
  value: number,
  viewValue: number
}

export interface CTCSSValue {
  value: number,
  viewValue: number
}

@Component({
  selector: 'app-nfm-mod',
  templateUrl: './nfm-mod.component.html',
  styleUrls: ['./nfm-mod.component.css']
})
export class NfmModComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: NFMModSettings = NFMMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  afBandwidthKhz: number;
  fmDeviationKhz: number;
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
  toneFrequencyKhz: number;
  report: NFMModReport = NFMMOD_REPORT_DEFAULT;
  ctcssValues: CTCSSValue[] = [ // The 32 EIA standard tones
    {value: 0, viewValue: 67.0},
    {value: 1, viewValue: 71.9},
    {value: 2, viewValue: 74.4},
    {value: 3, viewValue: 77.0},
    {value: 4, viewValue: 79.7},
    {value: 5, viewValue: 82.5},
    {value: 6, viewValue: 85.4},
    {value: 7, viewValue: 88.5},
    {value: 8, viewValue: 91.5},
    {value: 9, viewValue: 94.8},
    {value: 10, viewValue: 97.4},
    {value: 11, viewValue: 100.0},
    {value: 12, viewValue: 103.5},
    {value: 13, viewValue: 107.2},
    {value: 14, viewValue: 110.9},
    {value: 15, viewValue: 114.8},
    {value: 16, viewValue: 118.8},
    {value: 17, viewValue: 123.0},
    {value: 18, viewValue: 127.3},
    {value: 19, viewValue: 131.8},
    {value: 20, viewValue: 136.5},
    {value: 21, viewValue: 141.3},
    {value: 22, viewValue: 146.2},
    {value: 23, viewValue: 151.4},
    {value: 24, viewValue: 156.7},
    {value: 25, viewValue: 162.2},
    {value: 26, viewValue: 167.9},
    {value: 27, viewValue: 173.8},
    {value: 28, viewValue: 179.9},
    {value: 29, viewValue: 186.2},
    {value: 30, viewValue: 192.8},
    {value: 31, viewValue: 203.5},
  ];
  rfBandwidths: RFBandwidth[] = [
    {value: 3000, viewValue: 3},
    {value: 4000, viewValue: 4},
    {value: 5000, viewValue: 5},
    {value: 6250, viewValue: 6.25},
    {value: 8330, viewValue: 8.33},
    {value: 10000, viewValue: 10},
    {value: 12500, viewValue: 12.5},
    {value: 15000, viewValue: 15},
    {value: 20000, viewValue: 20},
    {value: 25000, viewValue: 25},
    {value: 40000, viewValue: 40},
  ];
  ctcss: boolean;

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
        if (channelSettings.channelType == "NFMMod") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.NFMModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency)/1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate/2))/1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate/2))/1000;
          this.afBandwidthKhz = this.settings.afBandwidth/1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.settings.volumeFactor = +this.settings.volumeFactor.toFixed(1);
          this.channelMute = this.settings.channelMute !== 0;
          this.fmDeviationKhz = +this.settings.fmDeviation/1000;
          this.toneFrequencyKhz = this.settings.toneFrequency / 1000;
          this.ctcss = this.settings.ctcssOn !== 0;
        } else {
          this.statusMessage = "Not a NFMMod channel";
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

  private setDeviceSettings(nfmModSettings : NFMModSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "NFMMod";
    settings.tx = 1,
    settings.NFMModSettings = nfmModSettings;
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
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.cwKeyer = cwSettings;
    this.setDeviceSettings(newSettings);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === "NFMMod") {
                this.report = channelReport.NFMModReport;
              }
            }
          )
        }
      )
    } else {
      this.channelReportSubscription.unsubscribe();
      this.channelReportSubscription = null;
    }
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  getRGBTitleStr() : string {
    return "rgb(" + this.rgbTitle[0].toString() + "," + this.rgbTitle[1].toString() + "," + this.rgbTitle[2].toString() + ")";
  }

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getDeltaFrequency() : number {
    let frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency/1000);
    return +frequency.toFixed(3);
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setAFBandwidth() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.afBandwidth = this.afBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setFMDeviation(){
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.fmDeviation = this.fmDeviationKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setVolume(){
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.volumeFactor = this.settings.volumeFactor;
    this.setDeviceSettings(newSettings);
  }

  setModulationSource() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.modAFInput = this.settings.modAFInput;
    this.setDeviceSettings(newSettings);
  }

  setToneFrequency() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.toneFrequency = this.toneFrequencyKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.rfBandwidth = this.settings.rfBandwidth;
    this.setDeviceSettings(newSettings);
  }

  setCTCSS() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.ctcssOn = this.ctcss ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setCTCSSIndex() {
    const newSettings: NFMModSettings = <NFMModSettings>{};
    newSettings.ctcssIndex = this.settings.ctcssIndex;
    this.setDeviceSettings(newSettings);
  }
}
