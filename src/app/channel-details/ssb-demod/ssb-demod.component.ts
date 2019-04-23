import { Component, OnInit } from '@angular/core';
import { SSBDemodSettings, SSBDEMOD_SETTINGS_DEFAULT, SSBDemodReport, SSBDEMOD_REPORT_DEFAULT } from './ssb-demod';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';

interface AudioDeviceInfo {
  value: string;
  viewValue: number;
}

interface Log2 {
  value: number;
  viewValue: number;
}

interface AudioSampleRates {
  [deviceName: string]: number;
}

@Component({
  selector: 'app-ssb-demod',
  templateUrl: './ssb-demod.component.html',
  styleUrls: ['./ssb-demod.component.css']
})
export class SsbDemodComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: SSBDemodSettings = SSBDEMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  lowCutoffKhz: number;
  audioMute: boolean;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  audioDevices: AudioDeviceInfo[] = [];
  audioSampleRates: AudioSampleRates = <AudioSampleRates>{};
  monitor: boolean;
  ssbDemodreport: SSBDemodReport = SSBDEMOD_REPORT_DEFAULT;
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
  agcTimeLog2s: Log2[] = [
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
    {value: 7, viewValue: 128},
    {value: 8, viewValue: 256},
    {value: 9, viewValue: 512},
    {value: 10, viewValue: 1024},
    {value: 11, viewValue: 2048},
  ];
  agcClamping: boolean;
  dsb: boolean;
  binaural: boolean;
  lrFlip: boolean;
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService,
    private audioStoreService: AudioStoreService) {
      this.deviceStoreSubscription = null;
      this.channelReportSubscription = null;
      this.monitor = false;
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.channelIndex = +this.route.snapshot.parent.params['cix'];
    this.getDeviceStorage();
    this.getAudioDevicesInfo();
    this.getChannelSettings();
  }

  private getDeviceStorage() {
    this.deviceStoreSubscription = this.deviceStoreService.get(this.deviceIndex).subscribe(
      deviceStorage => {
        this.deviceCenterFrequency = deviceStorage.centerFrequency;
        this.deviceBasebandRate = deviceStorage.basebandRate;
      },
      error => {
        if (error === 'No device at this index') {
          this.deviceSetService.getInfo(this.sdrangelURL, this.deviceIndex).subscribe(
            deviceset => {
              this.deviceStoreService.change(
                this.deviceIndex,
                {
                  basebandRate: deviceset.samplingDevice.bandwidth,
                  centerFrequency: deviceset.samplingDevice.centerFrequency
                }
              );
              this.deviceBasebandRate = deviceset.samplingDevice.bandwidth;
              this.deviceCenterFrequency = deviceset.samplingDevice.centerFrequency;
            }
          );
        }
      }
    );
  }

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'SSBDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.SSBDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.settings.volume = +this.settings.volume.toFixed(1);
          this.audioMute = this.settings.audioMute !== 0;
          this.hiCutKhz = this.settings.rfBandwidth / 1000;
          this.loCutKhz = this.settings.lowCutoff / 1000;
          this.setHiCutMinMax();
          this.setLoCutMinMax();
          this.agc = this.settings.agc !== 0;
          this.agcClamping = this.settings.agcClamping !== 0;
          this.dsb = this.settings.dsb !== 0;
          this.binaural = this.settings.audioBinaural !== 0;
          this.lrFlip = this.settings.audioFlipChannels !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a SSBDemod channel';
          this.statusError = true;
        }
      }
    );
  }

  private getAudioDevicesInfo() {
    if (!this.audioStoreService.isInitialized()) {
      this.audioStoreService.initialize();
    }
    this.audioStoreService.getOutput().subscribe(
      audioData => {
        this.audioDevices = [];
        for (const [key, value] of Object.entries(audioData)) {
          this.audioDevices.push({value: key, viewValue: value['audioRate']});
          this.audioSampleRates[key] = value['audioRate'];
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private setDeviceSettings(ssbDemodSettings: SSBDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'SSBDemod';
    settings.tx = 0,
    settings.SSBDemodSettings = ssbDemodSettings;
    this.channeldetailsService.setSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getChannelSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'SSBDemod') {
                this.ssbDemodreport = channelReport.SSBDemodReport;
              }
            }
          );
        }
      );
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
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getDeltaFrequency(): number {
    const frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency / 1000);
    return +frequency.toFixed(3);
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setAudioDevice() {
    this.setHiCutMinMax();
    this.setLoCutMinMax();
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    newSettings.rfBandwidth = this.hiCutKhz * 1000;
    newSettings.lowCutoff = this.loCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAudioMute() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.audioMute = this.audioMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.volume = this.settings.volume;
    this.setDeviceSettings(newSettings);
  }

  setSpan() {
    this.setHiCutMinMax();
    this.setLoCutMinMax();
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.spanLog2 = this.settings.spanLog2;
    newSettings.rfBandwidth = this.hiCutKhz * 1000;
    newSettings.lowCutoff = this.loCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private getAudioSampleRate(): number {
    if (this.settings.audioDeviceName in this.audioSampleRates) {
      return this.audioSampleRates[this.settings.audioDeviceName];
    } else {
      return 48000;
    }
  }

  getChannelBaseband(): number {
    return (this.getAudioSampleRate() / 1000) / (1 << this.settings.spanLog2);
  }

  private setHiCutMinMax() {
    const audioSampleRate = this.getAudioSampleRate();
    this.maxHiCutKhz = (audioSampleRate / (1 << this.settings.spanLog2)) / 1000;
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
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.rfBandwidth = this.hiCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLoCut() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.lowCutoff = this.loCutKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAGC() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.agc = this.agc ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAGCThreshold() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.agcPowerThreshold = this.settings.agcPowerThreshold;
    this.setDeviceSettings(newSettings);
  }

  setAGCTime() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.agcTimeLog2 = this.settings.agcTimeLog2;
    this.setDeviceSettings(newSettings);
  }

  setAGCThresholdGate() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.agcThresholdGate = this.settings.agcThresholdGate;
    this.setDeviceSettings(newSettings);
  }

  setAGCClamping() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.agcClamping = this.agcClamping ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setDSB() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.dsb = this.dsb ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBinaural() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.audioBinaural = this.binaural ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setFlipAudioChannels() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.audioFlipChannels = this.lrFlip ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: SSBDemodSettings = <SSBDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }
}
