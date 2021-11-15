import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { MyLocation, MY_LOCATION_DEFAULT } from 'src/app/main/location-dialog/location';
import { LocationService } from 'src/app/main/location-dialog/location.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelActions, ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { PacketModActions, PacketModReport, PacketModSettings, PACKETMOD_ACTIONS_DEFAULT, PACKETMOD_REPORT_DEFAULT, PACKETMOD_SETTINGS_DEFAULT } from './packet-mod';

export interface Standard {
  value: number;
  viewValue: string;
}

export interface Modulation {
  value: number;
  viewValue: string;
}

export interface Baud {
  value: number;
  viewValue: string;
}

export interface Call {
  value: string;
  viewValue: string;
}

export interface TxNbMessages {
  value: number;
  viewValue: string;
}

export interface PreEmphasisStandard {
  value: number;
  viewValue: string;
}

export interface PolynomialStandard {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-packet-mod',
  templateUrl: './packet-mod.component.html',
  styleUrls: ['./packet-mod.component.css']
})
export class PacketModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: PacketModSettings = PACKETMOD_SETTINGS_DEFAULT;
  report: PacketModReport = PACKETMOD_REPORT_DEFAULT;
  actions: PacketModActions = PACKETMOD_ACTIONS_DEFAULT;
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
  tauMicro: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  bbNoise: boolean;
  bpf: boolean;
  channelMute: boolean;
  modulateWhileRamping: boolean;
  preEmphasis: boolean;
  pulseShaping: boolean;
  repeat: boolean;
  rfNoise: boolean;
  scramble: boolean;
  udpEnabled: boolean;
  useReverseAPI: boolean;
  writeToFile: boolean;
  location: MyLocation = MY_LOCATION_DEFAULT;
  txStandards: Standard[] = [
    {value: 0, viewValue: '300 FSK'},
    {value: 1, viewValue: '1200 FSK'},
    {value: 2, viewValue: '1200 AFSK'},
    {value: 3, viewValue: '2400 FSK'},
    {value: 4, viewValue: '4800 FSK'},
    {value: 5, viewValue: '9600 FSK'},
  ];
  txStandard = 2;
  txModulations: Modulation[] = [
    {value: 0, viewValue: 'AFSK'},
    {value: 1, viewValue: 'FSK'}
  ];
  txBauds: Baud[] = [
    {value:    300, viewValue:    '300'},
    {value:    600, viewValue:    '600'},
    {value:   1200, viewValue:   '1200'},
    {value:   2400, viewValue:   '2400'},
    {value:   4800, viewValue:   '4800'},
    {value:   9600, viewValue:   '9600'},
    {value:  19200, viewValue:  '19200'},
  ];
  presetTos: Call[] = [
    {value: 'APRS', viewValue: 'APRS'},
    {value: 'APZ', viewValue: 'APZ'},
    {value: 'CQ', viewValue: 'CQ'},
    {value: 'BEACON', viewValue: 'BEACON'},
  ];
  presetTo = 'APRS';
  presetVias: Call[] = [
    {value: 'WIDE2-2', viewValue: 'WIDE2-2'},
    {value: 'ARISS', viewValue: 'ARISS'},
  ];
  presetVia = 'WIDE2-2';
  txNbMessages: TxNbMessages[] = [
    {value: -1, viewValue: 'Infinite'},
    {value: 10, viewValue: '10'},
    {value: 100, viewValue: '100'},
    {value: 1000, viewValue: '1000'},
  ];
  preEmphasisStandards: PreEmphasisStandard[] = [
    {value: 0, viewValue: 'NBFM'},
    {value: 1, viewValue: 'BFM US'},
    {value: 2, viewValue: 'BFM EU'},
  ];
  preEmphasisStandard = 0;
  polynomialStandards: PolynomialStandard[] = [
    {value: 0x10800, viewValue: '0x10800'}
  ];
  polynomialStandard = 0x10800;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService,
    private locationService: LocationService) {
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
    this.getLocation();
  }

  getLocation() {
    this.locationService.get(this.sdrangelURL + '/location').subscribe(
      location => {
        this.location.latitude = location.latitude;
        this.location.longitude = location.longitude;
      }
    );
  }

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'PacketMod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.PacketModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.fmDevKhz = this.settings.fmDeviation / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.channelMute = this.settings.channelMute !== 0;
          this.modulateWhileRamping = this.settings.modulateWhileRamping !== 0;
          this.preEmphasis = this.settings.preEmphasis !== 0;
          this.pulseShaping = this.settings.pulseShaping !== 0;
          this.repeat = this.settings.repeat !== 0;
          this.rfNoise = this.settings.rfNoise !== 0;
          this.scramble = this.settings.scramble !== 0;
          this.udpEnabled = this.settings.udpEnabled !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.writeToFile = this.settings.writeToFile !== 0;
          this.tauMicro = this.settings.preEmphasisTau * 1e6;
          this.settings.data = this.settings.data ?? '';
          if (!this.valueExists(this.presetTos, this.settings.to)) {
            this.presetTos.push({value: this.settings.to, viewValue: this.settings.to});
          }
          if (!this.valueExists(this.presetVias, this.settings.via)) {
            this.presetVias.push({value: this.settings.via, viewValue: this.settings.via});
          }
        } else {
          this.statusMessage = 'Not a PacketMod channel';
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

  private setChannelSettings(packetModSettings: PacketModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'PacketMod';
    settings.direction = 1,
    settings.PacketModSettings = packetModSettings;
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

  private postChannelActions(packetModActions: PacketModActions) {
    const actions: ChannelActions = <ChannelActions>{};
    actions.channelType = 'PacketMod';
    actions.direction = 1,
    actions.PacketModActions = packetModActions;
    this.channeldetailsService.postAction(this.sdrangelURL, this.deviceIndex, this.channelIndex, actions).subscribe(
      res => {
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getChannelSettings();
      },
      error => {
        this.statusMessage = 'Cannot post tx action';
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
              if (channelReport.channelType === 'PacketMod') {
                this.report = channelReport.PacketModReport;
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
    const newSettings: PacketModSettings = <PacketModSettings>{};
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
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setFMDeviation() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.fmDeviation = this.fmDevKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setTau() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.preEmphasisTau = this.tauMicro * 1e-6;
    this.setChannelSettings(newSettings);
  }

  setPreEmphasis() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.preEmphasis = this.preEmphasis ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setPreEmphasisHighFreq() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.preEmphasisHighFreq = this.settings.preEmphasisHighFreq;
    this.setChannelSettings(newSettings);
  }

  setBpf() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.bpf = this.bpf ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setBpfTaps() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.bpfTaps = this.settings.bpfTaps;
    this.setChannelSettings(newSettings);
  }

  setBpfLowCutoff() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.bpfLowCutoff = this.settings.bpfLowCutoff;
    this.setChannelSettings(newSettings);
  }

  setBpfHighCutoff() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.bpfHighCutoff = this.settings.bpfHighCutoff;
    this.setChannelSettings(newSettings);
  }

  setPreemphasisStandard() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    if (this.preEmphasisStandard === 0) { // Narrowband FM
      this.tauMicro = 531;
      newSettings.preEmphasisTau = 531 * 1e-6;
      newSettings.preEmphasisHighFreq = 3000;
      this.setChannelSettings(newSettings);
    } else if (this.preEmphasisStandard === 1) { // Broadcast US
      this.tauMicro = 75;
      newSettings.preEmphasisTau = 75 * 1e-6;
      newSettings.preEmphasisHighFreq = 12000;
      this.setChannelSettings(newSettings);
    } else if (this.preEmphasisStandard === 2) { // Broadcast EU
      this.tauMicro = 50;
      newSettings.preEmphasisTau = 50 * 1e-6;
      newSettings.preEmphasisHighFreq = 12000;
      this.setChannelSettings(newSettings);
    }
  }

  setScramble() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.scramble = this.scramble ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setPolynomialStandard() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    if (this.polynomialStandard === 0) { // 0x10800
      newSettings.polynomial = 0x10800;
      this.setChannelSettings(newSettings);
    }
  }

  setPolynomial() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.polynomial = this.settings.polynomial;
    this.setChannelSettings(newSettings);
  }

  setPulseShaping() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.pulseShaping = this.pulseShaping ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setBeta() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.beta = this.settings.beta;
    this.setChannelSettings(newSettings);
  }

  setSymbolSpan() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.symbolSpan = this.settings.symbolSpan;
    this.setChannelSettings(newSettings);
  }

  setMarkFrequency() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.markFrequency = this.settings.markFrequency;
    this.setChannelSettings(newSettings);
  }

  setSpaceFrequency() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.spaceFrequency = this.settings.spaceFrequency;
    this.setChannelSettings(newSettings);
  }

  setAx25PreFlags() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.ax25PreFlags = this.settings.ax25PreFlags;
    this.setChannelSettings(newSettings);
  }

  setAx25PostFlags() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.ax25PostFlags = this.settings.ax25PostFlags;
    this.setChannelSettings(newSettings);
  }

  setAx25Control() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.ax25Control = this.settings.ax25Control;
    this.setChannelSettings(newSettings);
  }

  setAx25PID() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.ax25PID = this.settings.ax25PID;
    this.setChannelSettings(newSettings);
  }

  setGain() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.gain = this.settings.gain;
    this.setChannelSettings(newSettings);
  }

  setTxModulation() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.modulation = this.settings.modulation;
    this.setChannelSettings(newSettings);
  }

  setTxBaud() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.baud = this.settings.baud;
    this.setChannelSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setRepeat() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.repeat = this.repeat ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setRepeatDelay() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.repeatDelay = this.settings.repeatDelay;
    this.setChannelSettings(newSettings);
  }

  setRepeatCount() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.repeatCount = this.settings.repeatCount;
    this.setChannelSettings(newSettings);
  }

  setModulateWhileRamping() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.modulateWhileRamping = this.modulateWhileRamping ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setRampUpBits() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.rampUpBits = this.settings.rampUpBits;
    this.setChannelSettings(newSettings);
  }

  setRampDownBits() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.rampDownBits = this.settings.rampDownBits;
    this.setChannelSettings(newSettings);
  }

  setRampRange() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.rampRange = this.settings.rampRange;
    this.setChannelSettings(newSettings);
  }

  setData() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.data = this.settings.data;
    this.setChannelSettings(newSettings);
  }

  setBbNoise()  {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.bbNoise = this.bbNoise ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setRfNoise()  {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.rfNoise = this.rfNoise ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setWriteToFile()  {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.writeToFile = this.writeToFile ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUdpEnabled()  {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.udpEnabled = this.udpEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUDpAddress() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpPort() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  private valueExists(arr, value) {
    return arr.some(function(el) {
      return el.value === value;
    });
  }

  setCallsign() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.callsign = this.settings.callsign;
    this.setChannelSettings(newSettings);
  }

  setTo() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.to = this.settings.to;
    this.setChannelSettings(newSettings);
  }

  setVia() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.via = this.settings.via;
    this.setChannelSettings(newSettings);
  }

  setPresetTo() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.to = this.presetTo;
    this.setChannelSettings(newSettings);
  }

  setPresetVia() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    newSettings.via = this.presetVia;
    this.setChannelSettings(newSettings);
  }

  private setTxCommon(packetModSettings: PacketModSettings) {
    packetModSettings.ax25PreFlags = 5;
    packetModSettings.ax25PostFlags = 4;
    packetModSettings.ax25PID = 0xf0;
    packetModSettings.ax25Control = 3;
    packetModSettings.preEmphasis = 0;
    packetModSettings.preEmphasisTau = 531e-6;
    packetModSettings.lpfTaps = 301;
    packetModSettings.rampUpBits = 8;
    packetModSettings.rampDownBits = 8;
    packetModSettings.rampRange = 60;
    packetModSettings.modulateWhileRamping = 1;
    packetModSettings.bpf = 0;
    packetModSettings.bpfLowCutoff = packetModSettings.spaceFrequency - 400;
    packetModSettings.bpfHighCutoff = packetModSettings.markFrequency + 400;
    packetModSettings.bpfTaps = 301;
    packetModSettings.pulseShaping = 1;
  }

  setTxStandard() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    if (this.txStandard === 0) { // 300 FSK
      newSettings.modulation = 1;
      newSettings.baud = 300;
      newSettings.rfBandwidth = 850;
      newSettings.fmDeviation = 200;
      newSettings.scramble = 0;
      this.setTxCommon(newSettings);
      this.setChannelSettings(newSettings);
    } else if (this.txStandard === 1) { // 1200 FSK
      newSettings.modulation = 1;
      newSettings.baud = 1200;
      newSettings.rfBandwidth = 6800;
      newSettings.fmDeviation = 2500;
      newSettings.scramble = 0;
      this.setTxCommon(newSettings);
      this.setChannelSettings(newSettings);
    } else if (this.txStandard === 2) { // 1200 AFSK
      newSettings.modulation = 0;
      newSettings.baud = 1200;
      newSettings.rfBandwidth = 12500;
      newSettings.fmDeviation = 2500;
      newSettings.spaceFrequency = 1200;
      newSettings.markFrequency = 2200;
      newSettings.scramble = 0;
      this.setTxCommon(newSettings);
      this.setChannelSettings(newSettings);
    } else if (this.txStandard === 3) { // 2400 FSK
      newSettings.modulation = 1;
      newSettings.baud = 2400;
      newSettings.rfBandwidth = 8600;
      newSettings.fmDeviation = 2500;
      newSettings.scramble = 0;
      this.setTxCommon(newSettings);
      this.setChannelSettings(newSettings);
    } else if (this.txStandard === 4) { // 4800 FSK
      newSettings.modulation = 1;
      newSettings.baud = 4800;
      newSettings.rfBandwidth = 12200;
      newSettings.fmDeviation = 2500;
      newSettings.scramble = 0;
      this.setTxCommon(newSettings);
      this.setChannelSettings(newSettings);
    } else if (this.txStandard === 5) { // 9600 FSK
      newSettings.modulation = 1;
      newSettings.baud = 9600;
      newSettings.rfBandwidth = 20000; // ~1.5*baud + 2*dev (derived from Carson rule)
      newSettings.fmDeviation = 3000;
      newSettings.scramble = 1;
      newSettings.polynomial = 0x10800;
      newSettings.beta = 0.5;
      newSettings.symbolSpan = 6;
      this.setTxCommon(newSettings);
      this.setChannelSettings(newSettings);
    }
  }

  tx() {
    const newActions: PacketModActions = <PacketModActions>{};
    newActions.tx = 1;
    this.postChannelActions(newActions);
  }

  insertLocation() {
    const newSettings: PacketModSettings = <PacketModSettings>{};
    const absLat = Math.abs(this.location.latitude * 100).toFixed(2).padStart(7, '0');
    const absLon = Math.abs(this.location.longitude * 100).toFixed(2).padStart(8, '0');
    const locationString = absLat + (this.location.latitude < 0 ? 'S' : 'N') + '/'
      + absLon + (this.location.longitude < 0 ? 'W' : 'E') + '-';
    newSettings.data = this.settings.data + locationString;
    this.setChannelSettings(newSettings);
  }
}
