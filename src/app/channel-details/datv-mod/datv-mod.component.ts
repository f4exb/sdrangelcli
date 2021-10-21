import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { DATVModReport, DATVModSettings, DATVMOD_REPORT_DEFAULT, DATVMOD_SETTINGS_DEFAULT } from './datv-mod';

interface Log2 {
  value: number;
  viewValue: number;
}

interface Standard {
  value: number;
  viewValue: string;
}

interface Source {
  value: number;
  viewValue: string;
}

interface FEC {
  value: number;
  viewValue: string;
}

const DVBS_FECS: FEC[] = [
  {value: 0, viewValue: '1/2'},
  {value: 1, viewValue: '2/3'},
  {value: 2, viewValue: '3/4'},
  {value: 3, viewValue: '5/6'}
];

const DVBS2_FECS: FEC[] = [
  {value: 8,  viewValue: '1/4'},
  {value: 9,  viewValue: '1/3'},
  {value: 10, viewValue: '2/5'},
  {value: 0,  viewValue: '1/2'},
  {value: 11, viewValue: '3/5'},
  {value: 1,  viewValue: '2/3'},
  {value: 2,  viewValue: '3/4'},
  {value: 5,  viewValue: '4/5'},
  {value: 3,  viewValue: '5/6'},
  // {value: 4,  viewValue: '7/8'},
  {value: 6,  viewValue: '8/9'},
  {value: 7,  viewValue: '9/10'}
];

interface Modulation {
  value: number;
  viewValue: string;
}

const DVBS_MODULATIONS = [
  {value: 0, viewValue: 'BPSK'},
  {value: 1, viewValue: 'QPSK'}
];

const DVBS2_MODULATIONS = [
  {value: 1, viewValue: 'QPSK'},
  {value: 2, viewValue: '8PSK'},
  {value: 3, viewValue: '16APSK'},
  {value: 4, viewValue: '32APSK'}
];

interface RollOff {
  value: number;
  viewValue: number;
}

const DVBS_ROLLOFFS = [
  {value: 0, viewValue: 0.35}
];

const DVBS2_ROLLOFFS = [
  {value: 0, viewValue: 0.2},
  {value: 1, viewValue: 0.25},
  {value: 2, viewValue: 0.35}
];

@Component({
  selector: 'app-datv-mod',
  templateUrl: './datv-mod.component.html',
  styleUrls: ['./datv-mod.component.css']
})
export class DatvModComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: DATVModSettings = DATVMOD_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  rfBandwidthMhz: number;
  standards: Standard[] = [
    {value: 0, viewValue: 'DVB-S'},
    {value: 1, viewValue: 'DVB-S2'}
  ];
  sources: Source[] = [
    {value: 0, viewValue: 'File'},
    {value: 1, viewValue: 'UDP'}
  ];
  fecs: FEC[] = DVBS_FECS;
  modulations: Modulation[] = DVBS_MODULATIONS;
  rollOffs: RollOff[] = DVBS_ROLLOFFS;
  rollOffIndex = 0;
  playLoop = false;
  play = false;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  channelMute: boolean;
  useReverseAPI: boolean;
  report: DATVModReport = DATVMOD_REPORT_DEFAULT;
  log2Interps: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
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
        if (channelSettings.channelType === 'DATVMod') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.DATVModSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rfBandwidthMhz = this.settings.rfBandwidth / 1000000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.channelMute = this.settings.channelMute !== 0;
          this.playLoop = this.settings.tsFilePlayLoop !== 0;
          this.play = this.settings.tsFilePlay !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          if (this.settings.standard === 0) { // DVB-S
            this.fecs = DVBS_FECS;
            this.modulations = DVBS_MODULATIONS;
            this.rollOffs = DVBS_ROLLOFFS;
          } else { // DVB-S2
            this.fecs = DVBS2_FECS;
            this.modulations = DVBS2_MODULATIONS;
            this.rollOffs = DVBS2_ROLLOFFS;
          }
          this.setRollOffIndex();
        } else {
          this.statusMessage = 'Not a DATVMod channel';
          this.statusError = true;
        }
      }
    );
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  setStandard() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.standard = this.settings.standard;
    this.seChannelSettings(newSettings);
  }

  setFEC() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.fec = this.settings.fec;
    this.seChannelSettings(newSettings);
  }

  setModulation() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.modulation = this.settings.modulation;
    this.seChannelSettings(newSettings);
  }

  private setRollOffIndex() {
    if (this.settings.standard === 0) { // DVB-S
      this.rollOffIndex = 0;
    } else { // DVB-S2
      if (this.settings.rollOff > 0.25) {
        this.rollOffIndex = 2;
      } else if (this.settings.rollOff > 0.2) {
        this.rollOffIndex = 1;
      } else {
        this.rollOffIndex = 0;
      }
    }
  }

  setRollOff() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.rollOff = this.rollOffs[this.rollOffIndex].viewValue;
    this.seChannelSettings(newSettings);
  }

  private seChannelSettings(datvModSettings: DATVModSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'DATVMod';
    settings.direction = 1,
    settings.DATVModSettings = datvModSettings;
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
              if (channelReport.channelType === 'DATVMod') {
                this.report = channelReport.DATVModReport;
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
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.seChannelSettings(newSettings);
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
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.seChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.title = this.settings.title;
    this.seChannelSettings(newSettings);
  }

  setSymbolRate() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.symbolRate = this.settings.symbolRate;
    this.seChannelSettings(newSettings);
  }

  setSource() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.tsSource = this.settings.tsSource;
    this.seChannelSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthMhz * 1000000;
    this.seChannelSettings(newSettings);
  }

  setPlayLoop() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.tsFilePlayLoop = this.playLoop ? 1 : 0;
    this.seChannelSettings(newSettings);
  }

  setPlay() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.tsFilePlay = this.play ? 1 : 0;
    this.seChannelSettings(newSettings);
  }

  setFileName() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.tsFileName = this.settings.tsFileName;
    this.seChannelSettings(newSettings);
  }

  setUDPAddress() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.seChannelSettings(newSettings);
  }

  setUDPPort() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.seChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.seChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.seChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.seChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.seChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: DATVModSettings = <DATVModSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.seChannelSettings(newSettings);
  }
}
