import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { AudioStoreService } from '../../main/audio/audio-store.service';
import { Subscription, interval } from 'rxjs';
import { DSDDemodSettings, DSDDEMOD_SETTINGS_DEFAULT, DSDDemodReport, DSDDEMOD_REPORT_DEFAULT } from './dsd-demod';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

interface AudioDeviceInfo {
  value: string;
  viewValue: number;
}

interface BaudRate {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-dsd-demod',
  templateUrl: './dsd-demod.component.html',
  styleUrls: ['./dsd-demod.component.css']
})
export class DsdDemodComponent implements OnInit {
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
  settings: DSDDemodSettings = DSDDEMOD_SETTINGS_DEFAULT;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  dsdDemodReport: DSDDemodReport = DSDDEMOD_REPORT_DEFAULT;
  squelchGateMs: number;
  hpFilter: boolean;
  audioMute: boolean;
  baudRates: BaudRate[] = [
    {value: 2400, viewValue: 2.4},
    {value: 4800, viewValue: 4.8},
  ];
  cosFiltering: boolean;
  symbolPLL: boolean;
  slot1: boolean;
  slot2: boolean;
  tdmaStereo: boolean;
  fmDevKhz: number;
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

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'DSDDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.DSDDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.settings.volume = +this.settings.volume.toFixed(1);
          this.squelchGateMs = this.settings.squelchGate * 10;
          this.hpFilter = this.settings.highPassFilter !== 0;
          this.audioMute = this.settings.audioMute !== 0;
          this.cosFiltering = this.settings.enableCosineFiltering !== 0;
          this.symbolPLL = this.settings.pllLock !== 0;
          this.slot1 = this.settings.slot1On !== 0;
          this.slot2 = this.settings.slot2On !== 0;
          this.tdmaStereo = this.settings.tdmaStereo !== 0;
          this.fmDevKhz = this.settings.fmDeviation / 1000;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a DSDDemod channel';
          this.statusError = true;
        }
      }
    );
  }

  private setDeviceSettings(dsdDemodSettings: DSDDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'DSDDemod';
    settings.direction = 0,
    settings.DSDDemodSettings = dsdDemodSettings;
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
              if (channelReport.channelType === 'DSDDemod') {
                this.dsdDemodReport = channelReport.DSDDemodReport;
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

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getDeltaFrequency(): number {
    const frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency / 1000);
    return +frequency.toFixed(3);
  }

  setRFBandwidth() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setSquelch() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.squelch = this.settings.squelch;
    this.setDeviceSettings(newSettings);
  }

  setSquelchGate() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.squelchGate = this.squelchGateMs / 10;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.volume = this.settings.volume;
    this.setDeviceSettings(newSettings);
  }

  setHPFilter() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.highPassFilter = this.hpFilter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAudioMute() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.audioMute = this.audioMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setCosFiltering() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.enableCosineFiltering = this.cosFiltering ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSymbolPLL() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.pllLock = this.symbolPLL ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSlot1() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.slot1On = this.slot1 ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSlot2() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.slot2On = this.slot2 ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTDMAStereo() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.tdmaStereo = this.tdmaStereo ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setFMDev() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.fmDeviation = this.fmDevKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setDemodGain() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.demodGain = this.settings.demodGain;
    this.setDeviceSettings(newSettings);
  }

  setAudioDevice() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  setBaudRate() {
    const newSettings: DSDDemodSettings = <DSDDemodSettings>{};
    newSettings.baudRate = this.settings.baudRate;
    this.setDeviceSettings(newSettings);
  }
}
