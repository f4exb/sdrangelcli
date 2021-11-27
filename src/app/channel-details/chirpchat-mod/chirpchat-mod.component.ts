import { N } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { ChirpChatModReport, ChirpChatModSettings, CHIRPCHATMOD_REPORT_DEFAULT, CHIRPCHATMOD_SETTINGS_DEFAULT } from './chirpchat-mod';

export interface Bandwidth {
  index: number;
  value: number;
  viewValue: string;
}

export interface CodingScheme {
  value: number;
  viewValue: string;
}

export interface MessageType {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-chirpchat-mod',
  templateUrl: './chirpchat-mod.component.html',
  styleUrls: ['./chirpchat-mod.component.css']
})
export class ChirpchatModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: ChirpChatModSettings = CHIRPCHATMOD_SETTINGS_DEFAULT;
  report: ChirpChatModReport = CHIRPCHATMOD_REPORT_DEFAULT;
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
  codingSchemes: CodingScheme[] = [
    {value: 0, viewValue: 'LoRa'},
    {value: 1, viewValue: 'ASCII'},
    {value: 2, viewValue: 'TTY'}
  ];
  messageTypes: MessageType[] = [
    {value:  0, viewValue: 'None'},
    {value:  1, viewValue: 'Beacon'},
    {value:  2, viewValue: 'CQ'},
    {value:  3, viewValue: 'Reply'},
    {value:  4, viewValue: 'Report'},
    {value:  5, viewValue: 'RReport'},
    {value:  6, viewValue: 'RRR'},
    {value:  7, viewValue: '73'},
    {value:  8, viewValue: 'QSOTxt'},
    {value:  9, viewValue: 'Text'},
    {value: 10, viewValue: 'Bytes'}
  ];
  channelMute: boolean;
  hasCRC: boolean;
  hasHeader: boolean;
  udpEnabled: boolean;
  useReverseAPI: boolean;
  quietSeconds: number;

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
        if (channelSettings.channelType === 'ChirpChatMod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.ChirpChatModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.channelMute = this.settings.channelMute !== 0;
          this.hasCRC = this.settings.hasCRC !== 0;
          this.hasHeader = this.settings.hasHeader !== 0;
          this.udpEnabled = this.settings.udpEnabled !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.quietSeconds = this.settings.quietMillis / 1000.0;
        } else {
          this.statusMessage = 'Not a ChirpChatMod channel';
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

  private setChannelSettings(chirpChatModSettings: ChirpChatModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'ChirpChatMod';
    settings.direction = 1,
    settings.ChirpChatModSettings = chirpChatModSettings;
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
              if (channelReport.channelType === 'ChirpChatMod') {
                this.report = channelReport.ChirpChatModReport;
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
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setChannelSettings(newSettings);
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
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setUdpEnabled()  {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.udpEnabled = this.udpEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUDpAddress() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpPort() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setMessageRepeat() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.messageRepeat = this.settings.messageRepeat;
    this.setChannelSettings(newSettings);
  }

  setTextMessage() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.textMessage = this.settings.textMessage;
    this.setChannelSettings(newSettings);
  }

  setMyLoc() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.myLoc = this.settings.myLoc;
    this.setChannelSettings(newSettings);
  }

  setMyRpt() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.myRpt = this.settings.myRpt;
    this.setChannelSettings(newSettings);
  }

  setUrCall() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.urCall = this.settings.urCall;
    this.setChannelSettings(newSettings);
  }

  setMyCall() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.myCall = this.settings.myCall;
    this.setChannelSettings(newSettings);
  }

  setSyncWord() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.syncWord = this.settings.syncWord < 0 ? 0 : this.settings.syncWord > 255 ? 255 : this.settings.syncWord;
    this.setChannelSettings(newSettings);
  }

  setHasHeader() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.hasHeader = this.hasHeader ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setHasCRC() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.hasCRC = this.hasCRC ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setNbParityBits() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.nbParityBits = this.settings.nbParityBits < 0 ? 0 : this.settings.nbParityBits > 4 ? 4 : this.settings.nbParityBits;
    this.setChannelSettings(newSettings);
  }

  setPreambleChirps() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.preambleChirps = this.settings.preambleChirps < 4 ? 4 : this.settings.preambleChirps > 20 ? 20 : this.settings.preambleChirps;
    this.setChannelSettings(newSettings);
  }

  setQuietSeconds() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.quietMillis = this.quietSeconds < 0.1 ? 100 : this.quietSeconds > 90 ? 90000 : this.quietSeconds * 1000.0;
    this.setChannelSettings(newSettings);
  }

  setCodingScheme() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.codingScheme = this.settings.codingScheme;
    this.setChannelSettings(newSettings);
  }

  setDEBits() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.deBits = this.settings.deBits < 0 ? 0 : this.settings.deBits > 4 ? 4 : this.settings.deBits;
    this.setChannelSettings(newSettings);
  }

  setSpreadFactor() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.spreadFactor = this.settings.spreadFactor < 7 ? 7 : this.settings.spreadFactor > 12 ? 12 : this.settings.spreadFactor;
    this.setChannelSettings(newSettings);
  }

  setBandwidth() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.bandwidthIndex = this.settings.bandwidthIndex;
    this.setChannelSettings(newSettings);
  }

  setMessageType() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.messageType = this.settings.messageType;
    this.setChannelSettings(newSettings);
  }

  getCurrentMessage(): string {
    if (this.settings.messageType === 0) { // None
      return '';
    } else if (this.settings.messageType === 1) { // Beacon
      return this.settings.beaconMessage;
    } else if (this.settings.messageType === 2) { // CQ
      return this.settings.cqMessage;
    } else if (this.settings.messageType === 3) { // Reply
      return this.settings.replyMessage;
    } else if (this.settings.messageType === 4) { // Report
      return this.settings.reportMessage;
    } else if (this.settings.messageType === 5) { // Reply report
      return this.settings.replyReportMessage;
    } else if (this.settings.messageType === 6) { // RRR
      return this.settings.rrrMessage;
    } else if (this.settings.messageType === 7) { // 73
      return this.settings.message73;
    } else if (this.settings.messageType === 8) { // QSO text
      return this.settings.qsoTextMessage;
    } else if (this.settings.messageType === 9) { // Text
      return this.settings.textMessage;
    } else if (this.settings.messageType === 10) { // Bytes
      return '';
    } else {
      return '';
    }
  }

  generateMessages() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    newSettings.beaconMessage = 'VVV DE ' + this.settings.myCall + ' ' + this.settings.myLoc;
    newSettings.cqMessage = 'CQ DE ' + this.settings.myCall + ' ' + this.settings.myLoc;
    newSettings.replyMessage = this.settings.urCall + ' ' + this.settings.myCall + ' ' + this.settings.myLoc;
    newSettings.reportMessage = this.settings.urCall + ' ' + this.settings.myCall + ' ' + this.settings.myRpt;
    newSettings.replyReportMessage = this.settings.urCall + ' ' + this.settings.myCall + ' R' + this.settings.myRpt;
    newSettings.rrrMessage = this.settings.urCall + ' ' + this.settings.myCall + ' RRR';
    newSettings.message73 = this.settings.urCall + ' ' + this.settings.myCall + ' 73';
    newSettings.qsoTextMessage = this.settings.urCall + ' ' + this.settings.myCall + ' ' + this.settings.textMessage;
    this.setChannelSettings(newSettings);
  }

  tx() {
    const newSettings: ChirpChatModSettings = <ChirpChatModSettings>{};
    const currentMsgType = this.settings.messageType;
    newSettings.messageType = 0; // cycle through None
    this.setChannelSettings(newSettings);
    newSettings.messageType = currentMsgType;
    this.setChannelSettings(newSettings);
  }
}
