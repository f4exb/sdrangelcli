import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelActions, ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { AISModActions, AISModReport, AISModSettings, AISMOD_ACTION_DEFAULT, AISMOD_REPORT_DEFAULT, AISMOD_SETTINGS_DEFAULT } from './ais-mod';

export interface MsgType {
  value: number;
  viewValue: string;
}

export interface Status {
  value: number;
  viewValue: string;
}

export interface TxMode {
  value: number;
  viewValue: string;
}

export interface TxNbMessages {
  value: number;
  viewValue: string;
}

export interface TxBaud {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-ais-mod',
  templateUrl: './ais-mod.component.html',
  styleUrls: ['./ais-mod.component.css']
})
export class AisModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: AISModSettings = AISMOD_SETTINGS_DEFAULT;
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
  rfNoise: boolean;
  writeToFile: boolean;
  useReverseAPI: boolean;
  channelMute: boolean;
  repeat: boolean;
  msgTypes: MsgType[] = [
    {value: 0, viewValue: 'Scheduled position report'},
    {value: 1, viewValue: 'Assigned position report'},
    {value: 2, viewValue: 'Special position report'},
    {value: 3, viewValue: 'Base station report'},
  ];
  statuses: Status[] = [
    {value: 0, viewValue: 'Under way using engine'},
    {value: 1, viewValue: 'At anchor'},
    {value: 2, viewValue: 'Not under command'},
    {value: 3, viewValue: 'Restricted manoeuvrability'},
    {value: 4, viewValue: 'Constrained by her draught'},
    {value: 5, viewValue: 'Moored'},
    {value: 6, viewValue: 'Aground'},
    {value: 7, viewValue: 'Engaged in fishing'},
    {value: 8, viewValue: 'Under way sailing'},
    {value: 9, viewValue: 'Not defined'},
  ];
  txModes: TxMode[] = [
    {value: 0, viewValue: 'Narrow'},
    {value: 1, viewValue: 'Wide'},
  ];
  txNbMessages: TxNbMessages[] = [
    {value: -1, viewValue: 'Infinite'},
    {value: 10, viewValue: '10'},
    {value: 100, viewValue: '100'},
    {value: 1000, viewValue: '1000'},
  ];
  txBauds: TxBaud[] = [
    {value:   300, viewValue:   '300'},
    {value:   600, viewValue:   '600'},
    {value:  1200, viewValue:  '1200'},
    {value:  2400, viewValue:  '2400'},
    {value:  4800, viewValue:  '4800'},
    {value:  9600, viewValue:  '9600'},
    {value: 38400, viewValue: '38400'},
  ];
  txMode = 0;
  report: AISModReport = AISMOD_REPORT_DEFAULT;
  actions: AISModActions = AISMOD_ACTION_DEFAULT;

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
        if (channelSettings.channelType === 'AISMod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.AISModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.fmDevKhz = this.settings.fmDeviation / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.udpEnabled = this.settings.udpEnabled !== 0;
          this.rfNoise = this.settings.rfNoise !== 0;
          this.writeToFile = this.settings.writeToFile !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.channelMute = this.settings.channelMute !== 0;
          this.repeat = this.settings.repeat !== 0;
          this.settings.bt = Math.round(this.settings.bt * 10) / 10;
        } else {
          this.statusMessage = 'Not an AISMod channel';
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

  private setChannelSettings(aisModSettings: AISModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'AISMod';
    settings.direction = 1,
    settings.AISModSettings = aisModSettings;
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

  private postChannelActions(aisModActions: AISModActions) {
    const actions: ChannelActions = <ChannelActions>{};
    actions.channelType = 'AISMod';
    actions.direction = 1,
    actions.AISModActions = aisModActions;
    this.channeldetailsService.postAction(this.sdrangelURL, this.deviceIndex, this.channelIndex, actions).subscribe(
      res => {
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getChannelSettings();
      },
      error => {
        this.statusMessage = 'Cannot post record action';
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
              if (channelReport.channelType === 'AISMod') {
                this.report = channelReport.AISModReport;
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
    const newSettings: AISModSettings = <AISModSettings>{};
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
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setFMDeviation() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.fmDeviation = this.fmDevKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setBT() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.bt = this.settings.bt;
    this.setChannelSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setMsgType() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.msgType = this.settings.msgType;
    this.setChannelSettings(newSettings);
  }

  setMMSI() {
    const newSettings: AISModSettings = <AISModSettings>{};
    if (!isNaN(+newSettings.mmsi)) {
      newSettings.mmsi = this.settings.mmsi;
      this.setChannelSettings(newSettings);
    } else {
      this.getChannelSettings();
    }
  }

  setStatus() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.status = this.settings.status;
    this.setChannelSettings(newSettings);
  }

  setLatitude() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.latitude = this.settings.latitude;
    this.setChannelSettings(newSettings);
  }

  setLongitude() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.longitude = this.settings.longitude;
    this.setChannelSettings(newSettings);
  }

  setCourse() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.course = this.settings.course;
    this.setChannelSettings(newSettings);
  }

  setSpeed() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.speed = this.settings.speed;
    this.setChannelSettings(newSettings);
  }

  setHeading() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.heading = this.settings.heading;
    this.setChannelSettings(newSettings);
  }

  setData() {
    const re = /[0-9A-Fa-f]*/g;
    if (re.test(this.settings.data)) {
      const newSettings: AISModSettings = <AISModSettings>{};
      newSettings.data = this.settings.data;
      this.setChannelSettings(newSettings);
    } else {
      this.getChannelSettings();
    }
  }

  setRepeat() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.repeat = this.repeat ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setGain() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.gain = this.settings.gain;
    this.setChannelSettings(newSettings);
  }

  setRepeatDelay() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.repeatDelay = this.settings.repeatDelay;
    this.setChannelSettings(newSettings);
  }

  setRepeatCount() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.repeatCount = this.settings.repeatCount;
    this.setChannelSettings(newSettings);
  }

  setBaud() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.baud = this.settings.baud;
    this.setChannelSettings(newSettings);
  }

  setSymbolSpan() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.symbolSpan = this.settings.symbolSpan;
    this.setChannelSettings(newSettings);
  }

  setRampUpBits() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.rampUpBits = this.settings.rampUpBits;
    this.setChannelSettings(newSettings);
  }

  setRampDownBits() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.rampDownBits = this.settings.rampDownBits;
    this.setChannelSettings(newSettings);
  }

  setRampRange() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.rampRange = this.settings.rampRange;
    this.setChannelSettings(newSettings);
  }

  setRfNoise() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.rfNoise = this.rfNoise ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setWriteToFile() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.writeToFile = this.writeToFile ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUdpEnabled()  {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.udpEnabled = this.udpEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUDpAddress() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpPort() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: AISModSettings = <AISModSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  encode() {
    const newActions: AISModActions = <AISModActions>{};
    newActions.encode = 1;
    this.postChannelActions(newActions);
  }

  tx() {
    const newActions: AISModActions = <AISModActions>{};
    newActions.tx = 1;
    this.postChannelActions(newActions);
  }

  setTxMode() {
    const newSettings: AISModSettings = <AISModSettings>{};
    if (this.txMode === 0) {
      newSettings.rfBandwidth = 12500;
      newSettings.fmDeviation = this.settings.baud * 0.25;
      newSettings.bt = 0.3;
      this.setChannelSettings(newSettings);
    } else if (this.txMode === 1) {
      newSettings.rfBandwidth = 25000;
      newSettings.fmDeviation = this.settings.baud * 0.5;
      newSettings.bt = 0.4;
      this.setChannelSettings(newSettings);
    }
  }
}
