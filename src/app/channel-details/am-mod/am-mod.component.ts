import { Component, OnInit } from '@angular/core';
import { AMModSettings, AMMOD_SETTINGS_DEFAULT, AMModReport, AMMOD_REPORT_DEFAULT } from './am-mod';
import { Subscription, interval } from 'rxjs';
import { CWKeyerSettings } from '../cw-keyer/cw-keyer';
import { ChannelSettings } from '../channel-details';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { Utils } from '../../common-components/utils';

interface AFInput {
  value: number;
  viewValue: string;
}

interface AudioDeviceInfo {
  value: string;
  viewValue: number;
}

@Component({
  selector: 'app-am-mod',
  templateUrl: './am-mod.component.html',
  styleUrls: ['./am-mod.component.css']
})
export class AmModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: AMModSettings = AMMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  modulationPercent: number;
  afInputs: AFInput[] = [
    { value: 0, viewValue: 'None' },
    { value: 1, viewValue: 'Tone' },
    { value: 2, viewValue: 'File' },
    { value: 3, viewValue: 'Audio' },
    { value: 4, viewValue: 'CW' },
  ];
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  audioDevices: AudioDeviceInfo[] = [];
  monitor: boolean;
  channelMute: boolean;
  toneFrequencyKhz: number;
  report: AMModReport = AMMOD_REPORT_DEFAULT;

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
        if (channelSettings.channelType === 'AMMod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.AMModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.settings.volumeFactor = +this.settings.volumeFactor.toFixed(1);
          this.channelMute = this.settings.channelMute !== 0;
          this.modulationPercent = +this.settings.modFactor.toFixed(2) * 100;
          this.toneFrequencyKhz = this.settings.toneFrequency / 1000;
        } else {
          this.statusMessage = 'Not an AMMod channel';
          this.statusError = true;
        }
      }
    );
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
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

  private setDeviceSettings(amModSettings: AMModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'AMMod';
    settings.tx = 1,
    settings.AMModSettings = amModSettings;
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

  onCWSettingsUpdate(cwSettings: CWKeyerSettings) {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.cwKeyer = cwSettings;
    this.setDeviceSettings(newSettings);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'AMMod') {
                this.report = channelReport.AMModReport;
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
    const newSettings: AMModSettings = <AMModSettings>{};
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
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setModulationPercent() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.modFactor = this.modulationPercent / 100;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.volumeFactor = this.settings.volumeFactor;
    this.setDeviceSettings(newSettings);
  }

  setModulationSource() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.modAFInput = this.settings.modAFInput;
    this.setDeviceSettings(newSettings);
  }

  setToneFrequency() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.toneFrequency = this.toneFrequencyKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAudioDevice() {
    const newSettings: AMModSettings = <AMModSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setDeviceSettings(newSettings);
  }
}
