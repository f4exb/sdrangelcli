import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { ChirpChatDemodReport, ChirpChatDemodSettings, CHIRPCHATDEMOD_REPORT_DEFAULT, CHIRPCHATDEMOD_SETTINGS_DEFAULT } from './chirpchat-demod';

export interface Bandwidth {
  index: number;
  value: number;
  viewValue: string;
}

export interface FFTWindow {
  value: number;
  viewValue: string;
}

export interface CodingScheme {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-chirpchat-demod',
  templateUrl: './chirpchat-demod.component.html',
  styleUrls: ['./chirpchat-demod.component.css']
})
export class ChirpchatDemodComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: ChirpChatDemodSettings = CHIRPCHATDEMOD_SETTINGS_DEFAULT;
  report: ChirpChatDemodReport = CHIRPCHATDEMOD_REPORT_DEFAULT;
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
  bandwidths: Bandwidth[] = [
    {index:  0, value:    325, viewValue: '325'},   // 384k / 1024
    {index:  1, value:    750, viewValue: '750'},   // 384k / 512
    {index:  2, value:   1500, viewValue: '1500'},  // 384k / 256
    {index:  3, value:   2604, viewValue: '2604'},  // 333k / 128
    {index:  4, value:   3125, viewValue: '3125'},  // 400k / 128
    {index:  5, value:   3906, viewValue: '3906'},  // 500k / 128
    {index:  6, value:   5208, viewValue: '5208'},  // 333k / 64
    {index:  7, value:   6250, viewValue: '6250'},  // 400k / 64
    {index:  8, value:   7813, viewValue: '7813'},  // 500k / 64
    {index:  9, value:  10417, viewValue: '10417'}, // 333k / 32
    {index: 10, value:  12500, viewValue: '12.5k'}, // 400k / 32
    {index: 11, value:  15625, viewValue: '15625'}, // 500k / 32
    {index: 12, value:  20833, viewValue: '20833'}, // 333k / 16
    {index: 13, value:  25000, viewValue: '25k'},   // 400k / 16
    {index: 14, value:  31250, viewValue: '31250'}, // 500k / 16
    {index: 15, value:  41667, viewValue: '41667'}, // 333k / 8
    {index: 16, value:  50000, viewValue: '50k'},   // 400k / 8
    {index: 17, value:  62500, viewValue: '62.5k'}, // 500k / 8
    {index: 18, value:  83333, viewValue: '83.3k'}, // 333k / 4
    {index: 19, value: 100000, viewValue: '100k'},  // 400k / 4
    {index: 20, value: 125000, viewValue: '125k'},  // 500k / 4
    {index: 21, value: 166667, viewValue: '167k'},  // 333k / 2
    {index: 22, value: 200000, viewValue: '200k'},  // 400k / 2
    {index: 23, value: 250000, viewValue: '250k'},  // 500k / 2
    {index: 24, value: 333333, viewValue: '333k'},  // 333k / 1
    {index: 25, value: 400000, viewValue: '400k'},  // 400k / 1
    {index: 26, value: 500000, viewValue: '500k'}   // 500k / 1
  ];
  fftWindows: FFTWindow[] = [
    {value: 0, viewValue: 'Bartlett'},
    {value: 1, viewValue: 'BmnHarris'},
    {value: 2, viewValue: 'Flattop'},
    {value: 3, viewValue: 'Hamming'},
    {value: 4, viewValue: 'Hanning'},
    {value: 5, viewValue: 'Rectangle'},
    {value: 6, viewValue: 'Kaiser'}
  ];
  codingSchemes: CodingScheme[] = [
    {value: 0, viewValue: 'LoRa'},
    {value: 1, viewValue: 'ASCII'},
    {value: 2, viewValue: 'TTY'}
  ];
  useReverseAPI: boolean;
  sendViaUDP: boolean;
  decodeActive: boolean;
  autoNbSymbolsMax: boolean;
  hasHeader: boolean;
  eomSquelch: number;
  hasCRC: boolean;

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
        if (channelSettings.channelType === 'ChirpChatDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.ChirpChatDemodSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.sendViaUDP = this.settings.sendViaUDP !== 0;
          this.decodeActive = this.settings.decodeActive !== 0;
          this.autoNbSymbolsMax = this.settings.autoNbSymbolsMax !== 0;
          this.hasHeader = this.settings.hasHeader !== 0;
          this.eomSquelch = this.settings.eomSquelchTenths / 10.0;
          this.hasCRC = this.settings.hasCRC !== 0;
        } else {
          this.statusMessage = 'Not a ChirpChatDemod channel';
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

  private setChannelSettings(chirpChatDemodSettings: ChirpChatDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'ChirpChatDemod';
    settings.direction = 0,
    settings.ChirpChatDemodSettings = chirpChatDemodSettings;
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
              if (channelReport.channelType === 'ChirpChatDemod') {
                this.report = channelReport.ChirpChatDemodReport;
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
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
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
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setSendViaUDP()  {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.sendViaUDP = this.sendViaUDP ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUDpAddress() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpPort() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  setNbSymbolsMax() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.nbSymbolsMax = this.settings.nbSymbolsMax;
    this.setChannelSettings(newSettings);
  }

  setEOMSquelch() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.eomSquelchTenths = this.eomSquelch * 10.0;
    this.setChannelSettings(newSettings);
  }

  setHasCRC() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.hasCRC = this.hasCRC ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setNbParityBits() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.nbParityBits = this.settings.nbParityBits < 0 ? 0 : this.settings.nbParityBits > 4 ? 4 : this.settings.nbParityBits;
    this.setChannelSettings(newSettings);
  }

  setHasHeader() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.hasHeader = this.hasHeader ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setAutoNbSymbolsMax() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.autoNbSymbolsMax = this.autoNbSymbolsMax ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setDecodeActive() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.decodeActive = this.decodeActive ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setPreambleChirps() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.preambleChirps = this.settings.preambleChirps < 4 ? 4 : this.settings.preambleChirps > 20 ? 20 : this.settings.preambleChirps;
    this.setChannelSettings(newSettings);
  }

  setDEBits() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.deBits = this.settings.deBits < 0 ? 0 : this.settings.deBits > 4 ? 4 : this.settings.deBits;
    this.setChannelSettings(newSettings);
  }

  setSpreadFactor() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.spreadFactor = this.settings.spreadFactor < 7 ? 7 : this.settings.spreadFactor > 12 ? 12 : this.settings.spreadFactor;
    this.setChannelSettings(newSettings);
  }

  setCodingScheme() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.codingScheme = this.settings.codingScheme;
    this.setChannelSettings(newSettings);
  }

  setFFTWindow() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.fftWindow = this.settings.fftWindow;
    this.setChannelSettings(newSettings);
  }

  setBandwidth() {
    const newSettings: ChirpChatDemodSettings = <ChirpChatDemodSettings>{};
    newSettings.bandwidthIndex = this.settings.bandwidthIndex;
    this.setChannelSettings(newSettings);
  }

  getHdrFECColor() {
    if (this.hasHeader && (this.report.headerParityStatus === 3)) { // OK
      return 'green';
    } else if (this.hasHeader && (this.report.headerParityStatus === 1)) { // Error
      return 'red';
    } else if (this.hasHeader && (this.report.headerParityStatus === 2)) { // Corrected
      return 'blue';
    } else {
      return 'grey';
    }
  }

  getHdrFECText() {
    if (this.hasHeader && (this.report.headerParityStatus === 3)) { // OK
      return 'Header parity OK';
    } else if (this.hasHeader && (this.report.headerParityStatus === 1)) { // Error
      return 'Header parity error';
    } else if (this.hasHeader && (this.report.headerParityStatus === 2)) { // Corrected
      return 'Header parity corrected';
    } else {
      return 'Header parity undefined';
    }
  }

  getHdrCRCColor() {
    if (this.hasHeader && (this.report.headerCRCStatus !== 0)) {
      return 'green';
    } else if (this.hasHeader && (this.report.headerCRCStatus === 0)) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  getHdrCRCText() {
    if (this.hasHeader && (this.report.headerCRCStatus !== 0)) {
      return 'Header CRC OK';
    } else if (this.hasHeader && (this.report.headerCRCStatus === 0)) {
      return 'Header CRC error';
    } else {
      return 'Header CRC undefined';
    }
  }

  getPayFECColor() {
    if (this.report.payloadParityStatus === 3) { // OK
      return 'green';
    } else if (this.report.payloadParityStatus === 1) { // Error
      return 'red';
    } else if (this.report.payloadParityStatus === 2) { // Corrected
      return 'blue';
    } else {
      return 'grey';
    }
  }

  getPayFECText() {
    if (this.report.payloadParityStatus === 3) { // OK
      return 'Payload parity OK';
    } else if (this.report.payloadParityStatus === 1) { // Error
      return 'Payload parity error';
    } else if (this.report.payloadParityStatus === 2) { // Corrected
      return 'Payload parity corrected';
    } else {
      return 'Payload parity undefined';
    }
  }

  getPayCRCColor() {
    if (this.report.payloadCRCStatus !== 0) {
      return 'green';
    } else if (this.report.payloadCRCStatus === 0) {
      return 'red';
    }
  }

  getPayCRCText() {
    if (this.report.payloadCRCStatus !== 0) {
      return 'Payload CRC OK';
    } else if (this.report.payloadCRCStatus === 0) {
      return 'Payload CRC error';
    }
  }
}
