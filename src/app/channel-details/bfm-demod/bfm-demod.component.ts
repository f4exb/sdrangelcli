import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { Subscription, interval } from 'rxjs';
import { BFMDemodSettings, BFMDEMOD_SETTINGS_DEFAULT, BFMDemodReport, BFMDEMOD_REPORT_DEFAULT, BFMDEMOD_RDS_REPORT_DEFAULT } from './bfm-demod';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

interface AudioDeviceInfo {
  value: string;
  viewValue: number;
}

interface RFBandwidth {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-bfm-demod',
  templateUrl: './bfm-demod.component.html',
  styleUrls: ['./bfm-demod.component.css']
})
export class BfmDemodComponent implements OnInit {
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  sdrangelURL: string;
  monitor: boolean;
  deviceIndex: number;
  channelIndex: number;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  audioDevices: AudioDeviceInfo[] = [];
  statusMessage: string;
  statusError = false;
  settings: BFMDemodSettings = BFMDEMOD_SETTINGS_DEFAULT;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  bfmDemodReport: BFMDemodReport = BFMDEMOD_REPORT_DEFAULT;
  audioStereo: boolean;
  rds: boolean;
  rfBandwidths: RFBandwidth[] = [
    {value: 80000, viewValue: 80},
    {value: 100000, viewValue: 100},
    {value: 120000, viewValue: 120},
    {value: 140000, viewValue: 140},
    {value: 160000, viewValue: 160},
    {value: 180000, viewValue: 180},
    {value: 200000, viewValue: 200},
    {value: 220000, viewValue: 220},
    {value: 250000, viewValue: 250},
  ];
  afBandwidthKhz: number;
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
      this.bfmDemodReport['rdsReport'] = BFMDEMOD_RDS_REPORT_DEFAULT;
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

  private getAudioDevicesInfo() {
    if (!this.audioStoreService.isInitialized()) {
      this.audioStoreService.initialize();
    }
    this.audioStoreService.getOutput().subscribe(
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

  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'BFMDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.BFMDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.settings.volume = +this.settings.volume.toFixed(1);
          this.audioStereo = this.settings.audioStereo !== 0;
          this.rds = this.settings.rdsActive !== 0;
          this.afBandwidthKhz = this.settings.afBandwidth / 1000;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a BFMDemod channel';
          this.statusError = true;
        }
      }
    );
  }

  private setDeviceSettings(bfmDemodSettings: BFMDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'BFMDemod';
    settings.tx = 0,
    settings.BFMDemodSettings = bfmDemodSettings;
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
              if (channelReport.channelType === 'BFMDemod') {
                this.bfmDemodReport = channelReport.BFMDemodReport;
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

  getPilotStatusColor(): string {
    if (this.bfmDemodReport.pilotLocked) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getPilotStatusText(): string {
    if (this.bfmDemodReport.pilotPowerDB) {
      return 'Pilot locked';
    } else {
      return 'Pilot unlocked';
    }
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getDeltaFrequency(): number {
    const frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency / 1000);
    return +frequency.toFixed(3);
  }

  setAudioDevice() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setDeviceSettings(newSettings);
  }

  setAudioStereo() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.audioStereo = this.audioStereo ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setRDS() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.rdsActive = this.rds ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.rfBandwidth = this.settings.rfBandwidth;
    this.setDeviceSettings(newSettings);
  }

  setAFBandwidth() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.afBandwidth = this.afBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.volume = this.settings.volume;
    this.setDeviceSettings(newSettings);
  }

  setSquelch() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.squelch = this.settings.squelch;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: BFMDemodSettings = <BFMDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }
}
