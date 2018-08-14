import { Component, OnInit } from '@angular/core';
import { SSBModSettings, SSBMOD_SETTINGS_DEFAULT, SSBModReport, SSBMOD_REPORT_DEFAULT } from './ssb-mod';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';
import { CWKeyerSettings } from '../cw-keyer/cw-keyer';

interface AudioDeviceInfo {
  value: string,
  viewValue: number
}

interface Log2 {
  value: number,
  viewValue: number
}

interface AGCTimeMs {
  value: number,
  viewValue: number
}

interface AudioSampleRates {
  [deviceName: string]: number
}

interface AFInput {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-ssb-mod',
  templateUrl: './ssb-mod.component.html',
  styleUrls: ['./ssb-mod.component.css']
})
export class SsbModComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: SSBModSettings = SSBMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  lowCutoffKhz: number;
  audioMute: boolean;
  statusMessage: string;
  statusError: boolean = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr: string = 'rgb(0,0,0)'
  audioDevices: AudioDeviceInfo[] = [];
  audioSampleRates: AudioSampleRates = <AudioSampleRates>{};
  monitor: boolean;
  report: SSBModReport = SSBMOD_REPORT_DEFAULT;
  spanLog2s: Log2[] = [
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ];
  hiCutKhz: number;
  loCutKhz: number;
  minHiCutKhz: number;
  maxHiCutKhz: number;
  minLoCutKhz: number;
  maxLoCutKhz: number;
  agc: boolean;
  dsb: boolean;
  usb: boolean;
  binaural: boolean;
  lrFlip: boolean;
  squelchGateMs: number;
  squelchDelayMs: number;
  agcTimeMss: AGCTimeMs[] = [
    { value: 1, viewValue: 1},
    { value: 2, viewValue: 2},
    { value: 5, viewValue: 5},
    { value: 10, viewValue: 10},
    { value: 20, viewValue: 20},
    { value: 50, viewValue: 50},
    { value: 100, viewValue: 100},
    { value: 200, viewValue: 200},
    { value: 500, viewValue: 500},
    { value: 990, viewValue: 990},
  ];
  agcTimeMs : number;
  agcThreshold: boolean;
  afInputs: AFInput[] = [
    { value: 0, viewValue: "None" },
    { value: 1, viewValue: "Tone" },
    { value: 2, viewValue: "File" },
    { value: 3, viewValue: "Audio" },
    { value: 4, viewValue: "CW" },
  ];
  toneFrequencyKhz: number;

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
    this.getAudioDevicesInfo();
    this.getChannelSettings();
  }

  ngOnDestroy() {
    (this.deviceStoreSubscription) && this.deviceStoreSubscription.unsubscribe();
    (this.channelReportSubscription) && this.channelReportSubscription.unsubscribe();
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

  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType == "SSBMod") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.SSBModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency)/1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate/2))/1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate/2))/1000;
          this.rfBandwidthKhz = this.settings.bandwidth/1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.settings.volumeFactor = +this.settings.volumeFactor.toFixed(1);
          this.audioMute = this.settings.audioMute !== 0;
          this.hiCutKhz = this.settings.bandwidth / 1000;
          this.loCutKhz = this.settings.lowCutoff / 1000;
          this.setHiCutMinMax();
          this.setLoCutMinMax();
          this.agc = this.settings.agc !== 0;
          this.dsb = this.settings.dsb !== 0;
          this.usb = this.settings.usb !== 0;
          this.binaural = this.settings.audioBinaural !== 0;
          this.lrFlip = this.settings.audioFlipChannels !== 0;
          this.settings.agcOrder = +this.settings.agcOrder.toFixed(2);
          this.agcTimeMs = (1000*this.settings.agcTime) / this.getAudioSampleRate();
          this.squelchGateMs = (1000*this.settings.agcThresholdGate) / this.getAudioSampleRate();
          this.squelchDelayMs = (1000*this.settings.agcThresholdDelay) / this.getAudioSampleRate();
          this.agcThreshold = this.settings.agcThreshold !== 0;
          this.toneFrequencyKhz = this.settings.toneFrequency / 1000;
        } else {
          this.statusMessage = "Not a SSBMod channel";
          this.statusError = true;
        }
      }
    )
  }

  private getAudioDevicesInfo() {
    if (!this.audioStoreService.isInitialized()) {
      this.audioStoreService.initialize();
    }
    this.audioStoreService.getInput().subscribe(
      audioData => {
        this.audioDevices = [];
        for (let [key, value] of Object.entries(audioData)) {
          this.audioDevices.push({value: key, viewValue: value["audioRate"]});
          this.audioSampleRates[key] = value["audioRate"];
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  private setDeviceSettings(ssbModSettings : SSBModSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "SSBMod";
    settings.tx = 1,
    settings.SSBModSettings = ssbModSettings;
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

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === "SSBMod") {
                this.report = channelReport.SSBModReport;
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

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
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
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setAudioMute() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.audioMute = this.audioMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.volumeFactor = this.settings.volumeFactor;
    this.setDeviceSettings(newSettings);
  }

  setSpan() {
    this.setHiCutMinMax();
    this.setLoCutMinMax();
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.spanLog2 = this.settings.spanLog2;
    newSettings.bandwidth = this.hiCutKhz * 1000;
    newSettings.lowCutoff = this.loCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private getAudioSampleRate() : number {
    if (this.settings.audioDeviceName in this.audioSampleRates) {
      return this.audioSampleRates[this.settings.audioDeviceName];
    } else {
      return 48000;
    }
  }

  getChannelBaseband() : number {
    return (this.getAudioSampleRate() / 1000) / (1<<this.settings.spanLog2);
  }

  private setHiCutMinMax() {
    let audioSampleRate = this.getAudioSampleRate();
    this.maxHiCutKhz = (audioSampleRate / (1<<this.settings.spanLog2))/1000;
    if (this.settings.dsb === 0) {
      this.minHiCutKhz = -this.maxHiCutKhz;
    } else {
      this.minHiCutKhz = 0;
    }
    if (this.hiCutKhz < 0) {
      if (this.hiCutKhz < this.minHiCutKhz) {
        this.hiCutKhz = this.minHiCutKhz;
      }
    } else {
      if (this.hiCutKhz > this.maxHiCutKhz) {
        this.hiCutKhz = this.maxHiCutKhz;
      }
    }
  }

  private setLoCutMinMax() {
    this.maxLoCutKhz = (this.hiCutKhz < 0 ? 0 : this.hiCutKhz);
    this.minLoCutKhz = (this.hiCutKhz < 0 ? this.hiCutKhz : 0);
    if (this.loCutKhz < 0) {
      if (this.loCutKhz < this.minLoCutKhz) {
        this.loCutKhz = this.minLoCutKhz;
      }
    } else {
      if (this.loCutKhz > this.maxLoCutKhz) {
        this.loCutKhz = this.maxLoCutKhz;
      }
    }
  }

  setHiCut() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.bandwidth = this.hiCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLoCut() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.lowCutoff = this.loCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setDSB() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.dsb = this.dsb ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setUSB() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.usb = this.usb ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBinaural() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.audioBinaural = this.binaural ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setFlipAudioChannels() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.audioFlipChannels = this.lrFlip ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAGC() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agc = this.agc ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAGCOrder() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agcOrder = this.settings.agcOrder;
    this.setDeviceSettings(newSettings);
  }

  setAGCTime() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agcTime = (this.agcTimeMs * this.getAudioSampleRate()) / 1000;
    this.setDeviceSettings(newSettings);
  }

  setSquelch() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agcThresholdEnable = this.agcThreshold ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSquelchThreshold() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agcThreshold = this.settings.agcThreshold;
    this.setDeviceSettings(newSettings);
  }

  setSquelchGate() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agcThresholdGate = (this.squelchGateMs * this.getAudioSampleRate()) / 1000;
    this.setDeviceSettings(newSettings);
  }

  setSquelchDelay() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.agcThresholdDelay = (this.squelchDelayMs * this.getAudioSampleRate()) / 1000;
    this.setDeviceSettings(newSettings);
  }

  setModulationSource() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.modAFInput = this.settings.modAFInput;
    this.setDeviceSettings(newSettings);
  }

  setToneFrequency() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.toneFrequency = this.toneFrequencyKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  onCWSettingsUpdate(cwSettings: CWKeyerSettings) {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.cwKeyer = cwSettings;
    this.setDeviceSettings(newSettings);
  }

  setAudioDevice() {
    const newSettings: SSBModSettings = <SSBModSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setDeviceSettings(newSettings);
  }
}
