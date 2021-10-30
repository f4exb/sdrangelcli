import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { AudioStoreService } from 'src/app/main/audio/audio-store.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { DATVDemodReport, DATVDemodSettings, DATV_DEMOD_REPORT_DEFAULT, DATV_DEMOD_SETTINGS_DEFAULT } from './datv-demod';

export interface AudioDeviceInfo {
  value: string;
  viewValue: number;
}

export interface DVBStandard {
  value: number;
  viewValue: string;
}

export interface DVBModulation {
  value: number;
  viewValue: string;
}

export const DVB_MODULATION_DVBS: DVBModulation[] = [
  {value: 0, viewValue: 'BPSK'},
  {value: 1, viewValue: 'QPSK'},
  {value: 2, viewValue: 'PSK8'}
];

export const DVB_MODULATION_DVBS2: DVBModulation[] = [
  {value: 1, viewValue: 'QPSK'},
  {value: 2, viewValue: 'PSK8'},
  {value: 3, viewValue: 'APSK16'},
  {value: 4, viewValue: 'APSK32'},
  {value: 5, viewValue: 'APSK64E'},
  {value: 6, viewValue: 'QAM16'},
  {value: 7, viewValue: 'QAM32'},
  {value: 8, viewValue: 'QAM256'}
];

export interface DVBFEC {
  value: number;
  viewValue: string;
}

export const DVB_FEC_DVBS: DVBFEC[] = [
  {value: 0, viewValue: '1/2'},
  {value: 1, viewValue: '2/3'},
  {value: 3, viewValue: '3/4'},
  {value: 4, viewValue: '5/6'},
  {value: 5, viewValue: '7/8'}
];

export const DVB_FEC_DVBS2: DVBFEC[] = [
  {value: 0,  viewValue: '1/2'},
  {value: 1,  viewValue: '2/3'},
  {value: 3,  viewValue: '3/4'},
  {value: 4,  viewValue: '5/6'},
  {value: 6,  viewValue: '4/5'},
  {value: 7,  viewValue: '8/9'},
  {value: 8,  viewValue: '9/10'},
  {value: 9,  viewValue: '1/4'},
  {value: 10, viewValue: '1/3'},
  {value: 11, viewValue: '2/5'},
  {value: 12, viewValue: '3/5'},
];

export interface DVBSampler {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-datv-demod',
  templateUrl: './datv-demod.component.html',
  styleUrls: ['./datv-demod.component.css']
})
export class DatvDemodComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: DATVDemodSettings = DATV_DEMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthKhz: number;
  standards: DVBStandard[] = [
    {value: 0, viewValue: 'DVB-S'},
    {value: 1, viewValue: 'DVB-S2'}
  ];
  modulations: DVBModulation[] = DVB_MODULATION_DVBS;
  fecs: DVBFEC[] = DVB_FEC_DVBS;
  filters: DVBSampler[] = [
    {value: 0, viewValue: 'Nearest'},
    {value: 1, viewValue: 'Linear'},
    {value: 2, viewValue: 'RRC'}
  ];
  audioMute: boolean;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  audioDevices: AudioDeviceInfo[] = [];
  useReverseAPI: boolean;
  monitor = false;
  softLDPC: boolean;
  allowDrift: boolean;
  fastLock: boolean;
  hardMetric: boolean;
  viterbi: boolean;
  videoMute: boolean;
  udpTS: boolean;
  playerEnable: boolean;
  report: DATVDemodReport = DATV_DEMOD_REPORT_DEFAULT;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService,
    private audioStoreService: AudioStoreService) {
      this.deviceStoreSubscription = null;
      this.channelReportSubscription = null;
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit(): void {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.channelIndex = +this.route.snapshot.parent.params['cix'];
    this.getDeviceStorage();
    this.getChannelSettings();
    this.getAudioDevicesInfo();
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
        if (channelSettings.channelType === 'DATVDemod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.DATVDemodSettings;
          this.channelDeltaFrequency = this.settings.centerFrequency;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.settings.audioVolume = +this.settings.audioVolume.toFixed(1);
          this.settings.rollOff = +this.settings.rollOff.toFixed(2);
          this.audioMute = this.settings.audioMute !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.softLDPC = this.settings.softLDPC !== 0;
          this.allowDrift = this.settings.allowDrift !== 0;
          this.fastLock = this.settings.fastLock !== 0;
          this.hardMetric = this.settings.hardMetric !== 0;
          this.viterbi = this.settings.viterbi !== 0;
          this.videoMute = this.settings.videoMute !== 0;
          this.udpTS = this.settings.udpTS !== 0;
          this.playerEnable = this.settings.playerEnable !== 0;
          if (this.settings.standard === 0) { // DVB-S
            this.modulations = DVB_MODULATION_DVBS;
            this.fecs = DVB_FEC_DVBS;
          } else { // DVB-S2
            this.modulations = DVB_MODULATION_DVBS2;
            this.fecs = DVB_FEC_DVBS2;
          }
        } else {
          this.statusMessage = 'Not a DATVDemod channel';
          this.statusError = true;
        }
      }
    );
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  private getAudioDevicesInfo() {
    if (!this.audioStoreService.isInitialized()) {
      this.audioStoreService.initialize();
    }
    this.audioStoreService.getInput().subscribe(
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

  private setChannelSettings(datvDemodSettings: DATVDemodSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'DATVDemod';
    settings.direction = 0,
    settings.DATVDemodSettings = datvDemodSettings;
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
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.centerFrequency = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
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
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setAudioDevice() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.audioDeviceName = this.settings.audioDeviceName;
    this.setChannelSettings(newSettings);
  }

  setAudioMute() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.audioMute = this.audioMute ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
    this.setChannelSettings(newSettings);
  }

  setVolume() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.audioVolume = this.settings.audioVolume;
    this.setChannelSettings(newSettings);
  }

  setVideoMute() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.videoMute = this.videoMute ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setStandard() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.standard = this.settings.standard;
    this.setChannelSettings(newSettings);
  }

  setModulation() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.modulation = this.settings.modulation;
    this.setChannelSettings(newSettings);
  }

  setFEC() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.fec = this.settings.fec;
    this.setChannelSettings(newSettings);
  }

  setSymbolRate() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.symbolRate = this.settings.symbolRate;
    this.setChannelSettings(newSettings);
  }

  setFastLock() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.fastLock = this.fastLock ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setAllowDrift() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.allowDrift = this.allowDrift ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setHardMetric() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.hardMetric = this.hardMetric ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setViterbi() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.viterbi = this.viterbi ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setSoftLDPC() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.softLDPC = this.softLDPC ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setMaxBitflips() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.maxBitflips = this.settings.maxBitflips;
    this.setChannelSettings(newSettings);
  }

  setFilter() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.filter = this.settings.filter;
    this.setChannelSettings(newSettings);
  }

  setRollOff() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.rollOff = this.settings.rollOff;
    this.setChannelSettings(newSettings);
  }

  setExcursion() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.excursion = this.settings.excursion;
    this.setChannelSettings(newSettings);
  }

  setPlayerEnable() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.playerEnable = this.playerEnable ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUdpTS() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.udpTS = this.udpTS ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setUdpTSAddress() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.udpTSAddress = this.settings.udpTSAddress;
    this.setChannelSettings(newSettings);
  }

  setUdpTSPort() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.udpTSPort = this.settings.udpTSPort;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: DATVDemodSettings = <DATVDemodSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  getModcodModulation(): string {
    if (this.report.modcodModulation === 0) {
      return 'BPSK';
    } else if (this.report.modcodModulation === 1) {
      return 'QPSK';
    } else if (this.report.modcodModulation === 2) {
      return 'PSK8';
    } else if (this.report.modcodModulation === 3) {
      return 'APSK16';
    } else if (this.report.modcodModulation === 4) {
      return 'APSK32';
    } else if (this.report.modcodModulation === 5) {
      return 'APSK64E';
    } else if (this.report.modcodModulation === 6) {
      return 'QAM16';
    } else if (this.report.modcodModulation === 7) {
      return 'QAM64';
    } else if (this.report.modcodModulation === 8) {
      return 'QAM256';
    }

    return 'Unset';
  }

  getModcodCodeRate(): string {
    if (this.report.modcodCodeRate === 0) {
      return '1/2';
    } else if (this.report.modcodCodeRate === 1) {
      return '2/3';
    } else if (this.report.modcodCodeRate === 2) {
      return '4/6';
    } else if (this.report.modcodCodeRate === 3) {
      return '3/4';
    } else if (this.report.modcodCodeRate === 4) {
      return '5/6';
    } else if (this.report.modcodCodeRate === 5) {
      return '7/8';
    } else if (this.report.modcodCodeRate === 6) {
      return '4/5';
    } else if (this.report.modcodCodeRate === 7) {
      return '8/9';
    } else if (this.report.modcodCodeRate === 8) {
      return '9/10';
    } else if (this.report.modcodCodeRate === 9) {
      return '1/4';
    } else if (this.report.modcodCodeRate === 10) {
      return '1/3';
    } else if (this.report.modcodCodeRate === 11) {
      return '2/5';
    } else if (this.report.modcodCodeRate === 12) {
      return '3/5';
    }

    return 'Unset';
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'DATVDemod') {
                this.report = channelReport.DATVDemodReport;
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

  getModcodStatusColor() {
    if (this.report.setByModcod) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getModcodStatusText() {
    if (this.report.setByModcod) {
      return 'Modulation and FEC set by DVB-S2 MODCOD';
    } else {
      return 'Modulation and FEC set manually';
    }
  }

  getUdpRunningStatusColor() {
    if (this.report.udpRunning) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getUdpRunningStatusText() {
    if (this.report.udpRunning) {
      return 'UDP thread is running';
    } else {
      return 'UDP thread is not running';
    }
  }

  getAudioDecodeStatusColor() {
    if (this.report.audioDecodeOK) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getAudioDecodeStatusText() {
    if (this.report.audioDecodeOK) {
      return 'Audio decode OK';
    } else {
      return 'Audio decode fails';
    }
  }

  getAudioActiveStatusColor() {
    if (this.report.audioActive) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getAudioActiveStatusText() {
    if (this.report.audioActive) {
      return 'Audio is active';
    } else {
      return 'Audio is not active';
    }
  }

  getVideoDecodeStatusColor() {
    if (this.report.videoDecodeOK) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getVideoDecodeStatusText() {
    if (this.report.audioDecodeOK) {
      return 'Video decode OK';
    } else {
      return 'Video decode fails';
    }
  }

  getVideoActiveStatusColor() {
    if (this.report.videoActive) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getVideoActiveStatusText() {
    if (this.report.videoActive) {
      return 'Video is active';
    } else {
      return 'Video is not active';
    }
  }

  getMERText() {
    return this.report.mer.toFixed(1) + ' dB';
  }

  getCNRText() {
    return this.report.cnr.toFixed(1) + ' dB';
  }
}
