import { Component, OnInit } from '@angular/core';
import { WFMModSettings, WFMMOD_SETTINGS_DEFAULT, WFMModReport, WFMMOD_REPORT_DEFAULT } from './wfm-mod';
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

@Component({
  selector: 'app-wfm-mod',
  templateUrl: './wfm-mod.component.html',
  styleUrls: ['./wfm-mod.component.css']
})
export class WfmModComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: WFMModSettings = WFMMOD_SETTINGS_DEFAULT;
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
  report: WFMModReport = WFMMOD_REPORT_DEFAULT;
  rfBandwidths: RFBandwidth[] = [
    {value: 12500, viewValue: 12.5},
    {value: 25000, viewValue: 25},
    {value: 40000, viewValue: 40},
    {value: 60000, viewValue: 60},
    {value: 75000, viewValue: 75},
    {value: 80000, viewValue: 80},
    {value: 100000, viewValue: 100},
    {value: 125000, viewValue: 125},
    {value: 140000, viewValue: 140},
    {value: 160000, viewValue: 160},
    {value: 180000, viewValue: 180},
    {value: 200000, viewValue: 200},
    {value: 220000, viewValue: 220},
    {value: 250000, viewValue: 250},
  ];

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
        if (channelSettings.channelType == "WFMMod") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.WFMModSettings;
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
        } else {
          this.statusMessage = "Not a WFMMod channel";
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

  private setDeviceSettings(wfmModSettings : WFMModSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "WFMMod";
    settings.tx = 1,
    settings.WFMModSettings = wfmModSettings;
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
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.cwKeyer = cwSettings;
    this.setDeviceSettings(newSettings);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === "WFMMod") {
                this.report = channelReport.WFMModReport;
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
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getDeltaFrequency() : number {
    return this.channelCenterFrequencyKhz - (this.deviceCenterFrequency/1000);
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setAFBandwidth() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.afBandwidth = this.afBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setFMDeviation(){
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.fmDeviation = this.fmDeviationKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setVolume(){
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.volumeFactor = this.settings.volumeFactor;
    this.setDeviceSettings(newSettings);
  }

  setModulationSource() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.modAFInput = this.settings.modAFInput;
    this.setDeviceSettings(newSettings);
  }

  setToneFrequency() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.toneFrequency = this.toneFrequencyKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: WFMModSettings = <WFMModSettings>{};
    newSettings.rfBandwidth = this.settings.rfBandwidth;
    this.setDeviceSettings(newSettings);
  }

}
