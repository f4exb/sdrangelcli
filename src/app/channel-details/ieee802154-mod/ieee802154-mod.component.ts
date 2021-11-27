import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelActions, ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { IEEE_802_15_4_ModActions, IEEE_802_15_4_MODACTIONS_DEFAULT, IEEE_802_15_4_ModReport, IEEE_802_15_4_MODREPORT_DEFAULT, IEEE_802_15_4_ModSettings, IEEE_802_15_4_MODSETTNGS_DEFAULT } from './ieee802154-mod';

export interface Standard {
  value: number;
  viewValue: string;
}

export interface Modulation {
  value: number;
  viewValue: string;
}

export interface BPS {
  value: number;
  viewValue: string;
}

export interface TxNbMessages {
  value: number;
  viewValue: string;
}

export interface PolynomialStandard {
  value: number;
  viewValue: string;
}

export interface PulseShaping {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-ieee802154-mod',
  templateUrl: './ieee802154-mod.component.html',
  styleUrls: ['./ieee802154-mod.component.css']
})
export class Ieee802154ModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: IEEE_802_15_4_ModSettings = IEEE_802_15_4_MODSETTNGS_DEFAULT;
  report: IEEE_802_15_4_ModReport = IEEE_802_15_4_MODREPORT_DEFAULT;
  actions: IEEE_802_15_4_ModActions = IEEE_802_15_4_MODACTIONS_DEFAULT;
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
  bbNoise: boolean;
  channelMute: boolean;
  modulateWhileRamping: boolean;
  repeat: boolean;
  scramble: boolean;
  subGHzBand: boolean;
  udpEnabled: boolean;
  useReverseAPI: boolean;
  writeToFile: boolean;
  txStandards: Standard[] = [
    {value: 0, viewValue: '20kbps BPSK'},
    {value: 1, viewValue: '40kbps BPSK'},
    {value: 2, viewValue: '100kbps <1GHz O-QPSK'},
    {value: 3, viewValue: '250kbps <1GHz O-QPSK (Sine)'},
    {value: 4, viewValue: '250kbps <1GHz O-QPSK (RC)'},
    {value: 5, viewValue: '250kbps >2GHz O-QPSK'},
  ];
  txStandard = 0;
  txModulations: Modulation[] = [
    {value: 0, viewValue: 'BPSK'},
    {value: 1, viewValue: 'O-QPSK'}
  ];
  txBPSs: BPS[] = [
    {value:   1200, viewValue: '1,2kbps'},
    {value:   2400, viewValue: '2.4kbps'},
    {value:   4800, viewValue: '4.8kbps'},
    {value:   9600, viewValue: '9.6kbps'},
    {value:  20000, viewValue: '20kbps'},
    {value:  40000, viewValue: '40kbps'},
    {value: 100000, viewValue: '100kbps'},
    {value: 250000, viewValue: '250kbps'},
  ];
  txNbMessages: TxNbMessages[] = [
    {value: -1, viewValue: 'Infinite'},
    {value: 10, viewValue: '10'},
    {value: 100, viewValue: '100'},
    {value: 1000, viewValue: '1000'},
  ];
  polynomialStandards: PolynomialStandard[] = [
    {value: 0x108, viewValue: '0x108'}
  ];
  polynomialStandard = 0x108;
  pulseShapings: PulseShaping[] = [
    {value: 0, viewValue: 'Raised Cosine'},
    {value: 1, viewValue: 'Half Sine'}
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
        if (channelSettings.channelType === 'IEEE_802_15_4_Mod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.IEEE_802_15_4_ModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.bbNoise = this.settings.bbNoise !== 0;
          this.channelMute = this.settings.channelMute !== 0;
          this.modulateWhileRamping = this.settings.modulateWhileRamping !== 0;
          this.repeat = this.settings.repeat !== 0;
          this.scramble = this.settings.scramble !== 0;
          this.subGHzBand = this.settings.subGHzBand !== 0;
          this.udpEnabled = this.settings.udpEnabled !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.writeToFile = this.settings.writeToFile !== 0;
          this.settings.data = this.settings.data ?? '';
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

  private setChannelSettings(ieee802154ModSettings: IEEE_802_15_4_ModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'IEEE_802_15_4_Mod';
    settings.direction = 1,
    settings.IEEE_802_15_4_ModSettings = ieee802154ModSettings;
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

  private postChannelActions(ieee802154ModActions: IEEE_802_15_4_ModActions) {
    const actions: ChannelActions = <ChannelActions>{};
    actions.channelType = 'IEEE_802_15_4_Mod';
    actions.direction = 1,
    actions.IEEE_802_15_4_ModActions = ieee802154ModActions;
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
              if (channelReport.channelType === 'IEEE_802_15_4_Mod') {
                this.report = channelReport.IEEE_802_15_4_ModReport;
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
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
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
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setWriteToFile()  {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.writeToFile = this.writeToFile ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUdpEnabled()  {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.udpEnabled = this.udpEnabled ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUDpAddress() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpPort() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  setModulation() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.modulation = this.settings.modulation;
    this.setChannelSettings(newSettings);
  }

  setBbNoise() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.bbNoise = this.bbNoise ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setSubGHzBand() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.subGHzBand = this.subGHzBand ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setRampRange() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.rampRange = this.settings.rampRange;
    this.setChannelSettings(newSettings);
  }

  setRampDownBits() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.rampDownBits = this.settings.rampDownBits;
    this.setChannelSettings(newSettings);
  }

  setRampUpBits() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.rampUpBits = this.settings.rampUpBits;
    this.setChannelSettings(newSettings);
  }

  setModulateWhileRamping() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.modulateWhileRamping = this.modulateWhileRamping ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setPolynomial() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.polynomial = this.settings.polynomial;
    this.setChannelSettings(newSettings);
  }

  setPolynomialStandard() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    if (this.polynomialStandard === 0) { // 0x108
      newSettings.polynomial = 0x108;
      this.setChannelSettings(newSettings);
    }
  }

  setScramble() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.scramble = this.scramble ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setSymbolSpan() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.symbolSpan = this.settings.symbolSpan;
    this.setChannelSettings(newSettings);
  }

  setBeta() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.beta = this.settings.beta;
    this.setChannelSettings(newSettings);
  }

  setPulseShaping() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.pulseShaping = this.settings.pulseShaping;
    this.setChannelSettings(newSettings);
  }

  setRepeatCount() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.repeatCount = this.settings.repeatCount;
    this.setChannelSettings(newSettings);
  }

  setRepeatDelay() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.repeatDelay = this.settings.repeatDelay;
    this.setChannelSettings(newSettings);
  }

  setRepeat() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.repeat = this.repeat ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setLpfTaps() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.lpfTaps = this.settings.lpfTaps;
    this.setChannelSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setData() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.data = this.settings.data;
    this.setChannelSettings(newSettings);
  }

  setGain() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.gain = this.settings.gain;
    this.setChannelSettings(newSettings);
  }

  setBitRate() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    newSettings.bitRate = this.settings.bitRate;
    newSettings.rfBandwidth = this.setBandwidthFromBitrate(newSettings.bitRate);
    this.setChannelSettings(newSettings);
  }

  private setBandwidthFromBitrate(bitRate: number): number {
    return 2.0 * bitRate * 15.0;
  }

  setTxStandard() {
    const newSettings: IEEE_802_15_4_ModSettings = <IEEE_802_15_4_ModSettings>{};
    if (this.txStandard === 0) { // 20 kbps BPSK
      newSettings.bitRate = 20000;
      newSettings.subGHzBand = 1;
      newSettings.pulseShaping = 0; // Raised Cosine
      newSettings.modulation = 0; // BPSK
      newSettings.beta = 1;
    } else if (this.txStandard === 1) { // 40 kbps BPSK
      newSettings.bitRate = 40000;
      newSettings.subGHzBand = 1;
      newSettings.pulseShaping = 0; // Raised Cosine
      newSettings.modulation = 0; // BPSK
      newSettings.beta = 1;
    } else if (this.txStandard === 2) { // 100 kbps O-QPSK
      newSettings.bitRate = 100000;
      newSettings.subGHzBand = 1;
      newSettings.pulseShaping = 0; // Raised Cosine
      newSettings.modulation = 1; // O-QPSK
      newSettings.beta = 0.8;
    } else if (this.txStandard === 3) { // 250 kbps O-QPSK Half Sine
      newSettings.bitRate = 250000;
      newSettings.subGHzBand = 1;
      newSettings.pulseShaping = 1; // Half Sine
      newSettings.modulation = 1; // O-QPSK
      newSettings.beta = 1;
    } else if (this.txStandard === 4) { // 250 kbps O-QPSK Rasied Cosine
      newSettings.bitRate = 250000;
      newSettings.subGHzBand = 1;
      newSettings.pulseShaping = 0; // Raised Cosine
      newSettings.modulation = 1; // O-QPSK
      newSettings.beta = 0.8;
    } else if (this.txStandard === 5) { // 250 kbps O-QPSK Half Sine > 2GHz
      newSettings.bitRate = 250000;
      newSettings.subGHzBand = 0;
      newSettings.pulseShaping = 0; // Raised Cosine
      newSettings.modulation = 1; // O-QPSK
      newSettings.beta = 0.8;
    }

    if ((this.txStandard >= 0) && (this.txStandard <= 5)) {
      newSettings.symbolSpan = 6;
      newSettings.rfBandwidth = this.setBandwidthFromBitrate(newSettings.bitRate);
      newSettings.spectrumRate = newSettings.rfBandwidth;
      this.setChannelSettings(newSettings);
    }
  }

  tx() {
    const newActions: IEEE_802_15_4_ModActions = <IEEE_802_15_4_ModActions>{};
    newActions.tx = 1;
    this.postChannelActions(newActions);
  }

  getChipRate(): number {
    let chipsPerSymbol, bitsPerSymbol;

    if (this.settings.modulation === 0) { // BPSK
        chipsPerSymbol = 15;
        bitsPerSymbol = 1;
    } else { // O-QPSK
        bitsPerSymbol = 4;
        chipsPerSymbol = this.settings.subGHzBand ? 16 : 32;
    }

    return this.settings.bitRate * chipsPerSymbol / bitsPerSymbol;
  }
}
