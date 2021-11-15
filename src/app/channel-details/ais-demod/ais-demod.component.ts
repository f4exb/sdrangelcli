import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { AISDemodReport, AISDemodSettings, AISDEMOD_REPORT_DEFAULT, AISDEMOD_SETTINGS_DEFAULT } from './ais-demod';

export interface UDPDataFormat {
  value: number;
  viewValue: string;
}

export interface RxBaud {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-ais-demod',
  templateUrl: './ais-demod.component.html',
  styleUrls: ['./ais-demod.component.css']
})
export class AisDemodComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: AISDemodSettings = AISDEMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  fmDevKhz: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  udpEnabled: boolean;
  logEnabled: boolean;
  useReverseAPI: boolean;
  report: AISDemodReport = AISDEMOD_REPORT_DEFAULT;
  udpDataFormats: UDPDataFormat[] = [
    {value: 0, viewValue: 'Binary'},
    {value: 1, viewValue: 'NMEA'}
  ];
  rxBauds: RxBaud[] = [
    {value:   300, viewValue:   '300'},
    {value:   600, viewValue:   '600'},
    {value:  1200, viewValue:  '1200'},
    {value:  2400, viewValue:  '2400'},
    {value:  4800, viewValue:  '4800'},
    {value:  9600, viewValue:  '9600'},
    {value: 38400, viewValue: '38400'},
  ];

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
        if (channelSettings.channelType === 'AISDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.AISDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.fmDevKhz = this.settings.fmDeviation / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.udpEnabled = this.settings.useReverseAPI !== 0;
          this.logEnabled = this.settings.logEnabled !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not an AISDemod channel';
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

  private setChannelSettings(aisDemodSettings: AISDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'AISDemod';
    settings.direction = 0,
    settings.AISDemodSettings = aisDemodSettings;
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
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
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
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setFMDeviation() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.fmDeviation = this.fmDevKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setCorrelationThreshold() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.correlationThreshold = this.settings.correlationThreshold;
    this.setChannelSettings(newSettings);
  }

  setUdpEnabled()  {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.udpEnabled = this.udpEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUDpAddress() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpPort() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setChannelSettings(newSettings);
  }

  setUdpFormat() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.udpFormat = this.settings.udpFormat;
    this.setChannelSettings(newSettings);
  }

  setLogEnabled()  {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.logEnabled = this.logEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setLogFilename() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.logFilename = this.settings.logFilename;
    this.setChannelSettings(newSettings);
  }

  setBaud() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.baud = this.settings.baud;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: AISDemodSettings = <AISDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'AISDemod') {
                this.report = channelReport.AISDemodReport;
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
}
