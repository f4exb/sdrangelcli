import { Component, OnInit } from '@angular/core';
import { FreeDVModSettings, FREEDVMOD_SETTINGS_DEFAULT, FreeDVModReport, FREEDVMOD_REPORT_DEFAULT } from './freedv-mod';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceStoreService } from 'src/app/device-store.service';
import { AudioStoreService } from 'src/app/main/audio/audio-store.service';
import { Utils } from 'src/app/common-components/utils';
import { ChannelSettings } from '../channel-details';

interface AFInput {
  value: number;
  viewValue: string;
}

interface FreeDVMode {
  value: number;
  viewValue: string;
}

interface Log2 {
  value: number;
  viewValue: number;
}

interface AudioDeviceInfo {
  value: string;
  viewValue: number;
}

@Component({
  selector: 'app-freedv-mod',
  templateUrl: './freedv-mod.component.html',
  styleUrls: ['./freedv-mod.component.css']
})
export class FreeDVModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: FreeDVModSettings = FREEDVMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  audioDevices: AudioDeviceInfo[] = [];
  monitor: boolean;
  audioMute: boolean;
  playLoop: boolean;
  gaugeInputElseModem: boolean;
  toneFrequencyKhz: number;
  afInputs: AFInput[] = [
    { value: 0, viewValue: 'None' },
    { value: 1, viewValue: 'Tone' },
    { value: 2, viewValue: 'File' },
    { value: 3, viewValue: 'Audio' }
  ];
  freeDVModes: FreeDVMode[] = [
    { value: 0, viewValue: '2400A' },
    { value: 1, viewValue: '1600' },
    { value: 2, viewValue: '800XA' },
    { value: 3, viewValue: '700C' },
    { value: 4, viewValue: '700D' },
  ];
  spanLog2s: Log2[] = [
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ];
  useReverseAPI: boolean;
  report: FreeDVModReport = FREEDVMOD_REPORT_DEFAULT;

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
    this.getChannelSettings();
    this.getAudioDevicesInfo();
  }

  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'FreeDVMod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.FreeDVModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.settings.volumeFactor = +this.settings.volumeFactor.toFixed(1);
          this.audioMute = this.settings.audioMute !== 0;
          this.playLoop = this.settings.playLoop !== 0;
          this.gaugeInputElseModem = this.settings.gaugeInputElseModem !== 0;
          this.toneFrequencyKhz = this.settings.toneFrequency / 1000;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a FreeDVMod channel';
          this.statusError = true;
        }
      }
    );
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  private getAudioDevicesInfo() {
    if (!this.audioStoreService.isInitialized()) {
      this.audioStoreService.initialize();
    }
    this.audioStoreService.getInput().subscribe(
      audioData => {
        this.audioDevices = [];
        for (const [key, value] of Object.entries(audioData)) {
          this.audioDevices.push({value: key, viewValue: value['audioRate']});
        }
      },
      error => {
        console.log(error);
      }
    );
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

  private setDeviceSettings(freeDVModSettings: FreeDVModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'FreeDVMod';
    settings.tx = 1,
    settings.FreeDVModSettings = freeDVModSettings;
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
              if (channelReport.channelType === 'FreeDVMod') {
                this.report = channelReport.FreeDVModReport;
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
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
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
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.volumeFactor = this.settings.volumeFactor;
    this.setDeviceSettings(newSettings);
  }

  setModulationSource() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.modAFInput = this.settings.modAFInput;
    this.setDeviceSettings(newSettings);
  }

  setFreeDVMode() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.freeDVMode = this.settings.freeDVMode;
    this.setDeviceSettings(newSettings);
  }

  setToneFrequency() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.toneFrequency = this.toneFrequencyKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAudioMute() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.audioMute = this.audioMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAudioDevice() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setDeviceSettings(newSettings);
  }

  setSpan() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.spanLog2 = this.settings.spanLog2;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: FreeDVModSettings = <FreeDVModSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  getChannelBaseband(): number {
    if (this.settings.freeDVMode === 0) { // only 2400A (index 0) runs at 48 kHz
      return 48 / (1 << this.settings.spanLog2);
    } else { // other modes run at 8 kHz
      return 8 / (1 << this.settings.spanLog2);
    }
  }
}
