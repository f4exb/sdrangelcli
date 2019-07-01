import { Component, OnInit } from '@angular/core';
import { FREQTRACKER_SETTINGS_DEFAULT, FreqTrackerSettings, FreqTrackerReport, FREQTRACKER_REPORT_DEFAULT } from './freqtracker-sink';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceStoreService } from 'src/app/device-store.service';
import { Utils } from 'src/app/common-components/utils';
import { ChannelSettings } from '../channel-details';
import { TouchSequence } from 'selenium-webdriver';

interface TrackerType {
  value: number;
  viewValue: string;
}

interface PSKOrder {
  value: number;
  viewValue: string;
}

interface Log2 {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-freqtracker-sink',
  templateUrl: './freqtracker-sink.component.html',
  styleUrls: ['./freqtracker-sink.component.css']
})
export class FreqtrackerSinkComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: FreqTrackerSettings = FREQTRACKER_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  rfMaxBandwidthKhz: number;
  squelchGateMs: number;
  alphaEMARounded: number;
  tracking: boolean;
  rrc: boolean;
  monitor: boolean;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  trackerTypes: TrackerType[] = [
    { value: 0, viewValue: 'None'},
    { value: 1, viewValue: 'FLL'},
    { value: 2, viewValue: 'PLL'},
  ];
  pskOrders: PSKOrder[] = [
    { value: 1, viewValue: 'CW'},
    { value: 2, viewValue: 'BPSK'},
    { value: 4, viewValue: 'QPSK'},
    { value: 8, viewValue: '8-PSK'},
    { value: 16, viewValue: '16-PSK'},
  ];
  log2Decims: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  useReverseAPI: boolean;
  report: FreqTrackerReport = FREQTRACKER_REPORT_DEFAULT;

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

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'FreqTracker') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.FreqTrackerSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rfMaxBandwidthKhz = this.deviceBasebandRate / (1000 * (1 << this.settings.log2Decim));
          this.squelchGateMs = this.settings.squelchGate * 10;
          this.alphaEMARounded = Math.round(this.settings.alphaEMA * 100) / 100;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.tracking = this.settings.tracking !== 0;
          this.rrc = this.settings.rrc !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a FreqTracker channel';
          this.statusError = true;
        }
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

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  private setDeviceSettings(freqTrackerSettings: FreqTrackerSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'FreqTracker';
    settings.direction = 0,
    settings.FreqTrackerSettings = freqTrackerSettings;
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
              if (channelReport.channelType === 'FreqTracker') {
                this.report = channelReport.FreqTrackerReport;
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
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
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
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setSquelch() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.squelch = this.settings.squelch;
    this.setDeviceSettings(newSettings);
  }

  setSquelchGate() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.squelchGate = this.squelchGateMs / 10;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setTrackerType() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.trackerType = this.settings.trackerType;
    this.setDeviceSettings(newSettings);
  }

  setPSKOrder() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.pllPskOrder = this.settings.pllPskOrder;
    this.setDeviceSettings(newSettings);
  }

  setRRC() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.rrc = this.rrc ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setRRCRolloff() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.rrcRolloff = this.settings.rrcRolloff;
    this.setDeviceSettings(newSettings);
  }

  setTracking() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.tracking = this.tracking ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setDecim() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.rfMaxBandwidthKhz = this.deviceBasebandRate / (1000 * (1 << this.settings.log2Decim));
    this.setDeviceSettings(newSettings);
  }

  setAlpha() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.alphaEMA = this.alphaEMARounded;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: FreqTrackerSettings = <FreqTrackerSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  getChannelBaseband(): number {
    return (this.deviceBasebandRate / 1000) / (1 << this.settings.log2Decim);
  }
}
