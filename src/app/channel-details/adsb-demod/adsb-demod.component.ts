import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { ADSBDemodReport, ADSBDemodSettings, ADSBDEMOD_REPORT_DEFAULT, ADSBDEMOD_SETTINGS_DEFAULT } from './adsb-demod';

export interface DemodSR {
  value: number;
  viewValue: string;
}

export interface FeedFormat {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-adsb-demod',
  templateUrl: './adsb-demod.component.html',
  styleUrls: ['./adsb-demod.component.css']
})
export class AdsbDemodComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: ADSBDemodSettings = ADSBDEMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  beastEnabled: boolean;
  logEnabled: boolean;
  useReverseAPI: boolean;
  correlateFullPreamble: boolean;
  demodModeS: boolean;
  report: ADSBDemodReport = ADSBDEMOD_REPORT_DEFAULT;
  demodSRs: DemodSR[] = [
    {value:  2, viewValue: '2M'},
    {value:  4, viewValue: '4M'},
    {value:  6, viewValue: '6M'},
    {value:  8, viewValue: '8M'},
    {value: 10, viewValue: '10M'},
    {value: 12, viewValue: '12M'}
  ];
  feedFormats: FeedFormat[] = [
    {value: 0, viewValue: 'Beast binary'},
    {value: 1, viewValue: 'Beast hex'}
  ];
  devFeatures = false;

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

  ngOnInit(): void {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.channelIndex = +this.route.snapshot.parent.params['cix'];
    this.getDeviceStorage();
    this.getChannelSettings();
  }

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'ADSBDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.ADSBDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.beastEnabled = this.settings.beastEnabled !== 0;
          this.logEnabled = this.settings.logEnabled !== 0;
          this.correlateFullPreamble = this.settings.correlateFullPreamble !== 0;
          this.demodModeS = this.settings.demodModeS !== 0;
        } else {
          this.statusMessage = 'Not an ADSBDemod channel';
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

  private setChannelSettings(adsbDemodSettings: ADSBDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'ADSBDemod';
    settings.direction = 0,
    settings.ADSBDemodSettings = adsbDemodSettings;
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

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setChannelSettings(newSettings);
  }

  getDeltaFrequency(): number {
    const frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency / 1000);
    return +frequency.toFixed(3);
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setSamplesPerBit() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.samplesPerBit = this.settings.samplesPerBit;
    this.setChannelSettings(newSettings);
  }

  setCorrelationThreshold() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.correlationThreshold = this.settings.correlationThreshold;
    this.setChannelSettings(newSettings);
  }

  setDemodModeS()  {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.demodModeS = this.demodModeS ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setCorrelateFullPreamble()  {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.correlateFullPreamble = this.correlateFullPreamble ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setBeastEnabled()  {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.beastEnabled = this.beastEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setBeastHost() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.beastHost = this.settings.beastHost;
    this.setChannelSettings(newSettings);
  }

  setBeastPort() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.beastPort = this.settings.beastPort;
    this.setChannelSettings(newSettings);
  }

  setFeedFormat() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.feedFormat = this.settings.feedFormat;
    this.setChannelSettings(newSettings);
  }

  setInterpolatorPhaseSteps() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.interpolatorPhaseSteps = this.settings.interpolatorPhaseSteps;
    this.setChannelSettings(newSettings);
  }

  setInterpolatorTapsPerPhase() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.interpolatorTapsPerPhase = this.settings.interpolatorTapsPerPhase;
    this.setChannelSettings(newSettings);
  }

  setLogEnabled()  {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.logEnabled = this.logEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setLogFilename() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.logFilename = this.settings.logFilename;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: ADSBDemodSettings = <ADSBDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'ADSBDemod') {
                this.report = channelReport.ADSBDemodReport;
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

  getTargetRange() {
    return (this.report.targetRange / 1000).toFixed(1);
  }
}
