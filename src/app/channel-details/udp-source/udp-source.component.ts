import { Component, OnInit } from '@angular/core';
import { UDPSourceSettings, UDP_SOURCE_SETTINGS_DEFAULT, UDPSourceReport, UDP_SOURCE_REPORT_DEFAULT } from './udp-source';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

interface SampleFormat {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-udp-source',
  templateUrl: './udp-source.component.html',
  styleUrls: ['./udp-source.component.css']
})
export class UdpSourceComponent implements OnInit {
  sampleFormats: SampleFormat[] = [
    {value: 0, viewValue: 'SnLE I/Q'},
    {value: 1, viewValue: 'S16LE NFM'},
    {value: 2, viewValue: 'S16LE LSB'},
    {value: 3, viewValue: 'S16LE USB'},
    {value: 4, viewValue: 'S16LE AM'},
  ];
  amPercent: number;
  autoRWBalance: boolean;
  channelMute: boolean;
  fmDeviationKhz: number;
  rfBandwidthKhz: number;
  lowCutoffKhz: number;
  squelchGateMs: number;
  stereoInput: boolean;
  squelchEnabled: boolean;
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: UDPSourceSettings = UDP_SOURCE_SETTINGS_DEFAULT;
  report: UDPSourceReport = UDP_SOURCE_REPORT_DEFAULT;
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
  monitor: boolean;
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
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
        if (channelSettings.channelType === 'UDPSource') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.UDPSourceSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.lowCutoffKhz = this.settings.lowCutoff / 1000;
          this.fmDeviationKhz = this.settings.fmDeviation / 1000;
          this.amPercent = +(this.settings.amModFactor * 100).toFixed(0);
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.channelMute = this.settings.channelMute !== 0;
          this.squelchEnabled = this.settings.squelchEnabled !== 0;
          this.autoRWBalance = this.settings.autoRWBalance !== 0;
          this.stereoInput = this.settings.stereoInput !== 0;
          this.settings.gainIn = +this.settings.gainIn.toFixed(1);
          this.settings.gainOut = +this.settings.gainOut.toFixed(1);
          this.squelchGateMs = +(this.settings.squelchGate * 1000).toFixed(0);
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a UDPSource channel';
          this.statusError = true;
        }
      }
    );
  }

  private setDeviceSettings(udpSinkSettings: UDPSourceSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'UDPSource';
    settings.tx = 1,
    settings.UDPSourceSettings = udpSinkSettings;
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
              if (channelReport.channelType === 'UDPSource') {
                this.report = channelReport.UDPSourceReport;
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
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
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
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setGainIn() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.gainIn = this.settings.gainIn;
    this.setDeviceSettings(newSettings);
  }

  setGainOut() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.gainOut = this.settings.gainOut;
    this.setDeviceSettings(newSettings);
  }

  setSampleFormat() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.sampleFormat = this.settings.sampleFormat;
    this.setDeviceSettings(newSettings);
  }

  setAddress() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setDeviceSettings(newSettings);
  }

  setPort() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.inputSampleRate = this.settings.inputSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setBandwidth() {
    this.validateLowCutoff();
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLowCutoff() {
    this.validateLowCutoff();
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.lowCutoff = this.lowCutoffKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateLowCutoff() {
    if (this.lowCutoffKhz > this.rfBandwidthKhz) {
      this.lowCutoffKhz = this.rfBandwidthKhz;
    } else if (this.lowCutoffKhz < 0) {
      this.lowCutoffKhz = 0;
    }
  }

  setFMDeviation() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.fmDeviation = this.fmDeviationKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAmModFactor() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.amModFactor = this.amPercent / 100;
    this.setDeviceSettings(newSettings);
  }

  setSquelchEnabled() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.squelchEnabled = this.squelchEnabled ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSquelch() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.squelch = this.settings.squelch;
    this.setDeviceSettings(newSettings);
  }

  setSquelchGate() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.squelchGate = this.squelchGateMs / 1000;
    this.setDeviceSettings(newSettings);
  }

  setStereoInput() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.stereoInput = this.stereoInput ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAutoRWBalance() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.autoRWBalance = this.autoRWBalance ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: UDPSourceSettings = <UDPSourceSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }
}
