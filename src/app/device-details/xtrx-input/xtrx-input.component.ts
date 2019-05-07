import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { XTRXInputSettings, XTRX_INPUT_SETTINGS_DEFAULT, XTRX_INPUT_REPORT_DEFAULT, XTRXInputReport } from './xtrx-input';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Subscription, interval } from 'rxjs';

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface GainMode {
  value: number;
  viewValue: string;
}

export interface AntennaPath {
  value: number;
  viewValue: string;
}

export interface PowerMode {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-xtrx-input',
  templateUrl: './xtrx-input.component.html',
  styleUrls: ['./xtrx-input.component.css']
})
export class XtrxInputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  softDecims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  hardDecims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ];
  gainModes: GainMode[] = [
    {value: 0, viewValue: 'Auto'},
    {value: 1, viewValue: 'Manual'},
  ];
  antennaPaths: AntennaPath[] = [
    {value: 0, viewValue: 'Low'},
    {value: 1, viewValue: 'Wide'},
    {value: 2, viewValue: 'High'},
  ];
  powerModes: PowerMode[] = [
    {value: 0, viewValue: '0:Save max'},
    {value: 1, viewValue: '1:'},
    {value: 2, viewValue: '2:'},
    {value: 3, viewValue: '3:Economy'},
    {value: 4, viewValue: '4:Optimal'},
    {value: 5, viewValue: '5:'},
    {value: 6, viewValue: '6:'},
    {value: 7, viewValue: '7:Perf max'},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  report: XTRXInputReport = XTRX_INPUT_REPORT_DEFAULT;
  settings: XTRXInputSettings = XTRX_INPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loFreqKhz: number;
  ncoFreqKhz: number;
  lpfBWkHz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  transverter: boolean;
  ncoEnable: boolean;
  extClock: boolean;
  useReverseAPI: boolean;
  deviceReportSubscription: Subscription;
  monitor: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getDeviceSettings();
    });
  }

  getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === 'XTRX') && (deviceSettings.direction === 0)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.xtrxInputSettings;
          this.ncoFreqKhz = this.settings.ncoFrequency / 1000;
          this.ncoEnable = this.settings.ncoEnable !== 0;
          this.loFreqKhz = this.settings.centerFrequency / 1000;
          this.centerFreqKhz = this.loFreqKhz + (this.ncoEnable ? this.ncoFreqKhz : 0);
          this.lpfBWkHz = this.settings.lpfBW / 1000;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.extClock = this.settings.extClock !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a XTRX input device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate / (1 << this.settings.log2SoftDecim)
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            devicelReport => {
              if ((devicelReport.deviceHwType === 'XTRX') && (devicelReport.direction === 0)) {
                this.report = devicelReport.xtrxInputReport;
              }
            }
          );
        }
      );
    } else {
      this.deviceReportSubscription.unsubscribe();
      this.deviceReportSubscription = null;
    }
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  private setDeviceSettings(xtrxInputSettings: XTRXInputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'XTRX';
    settings.direction = 0,
    settings.xtrxInputSettings = xtrxInputSettings;
    this.devicedetailsService.setSettings(this.sdrangelURL, this.deviceIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getDeviceSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  getSampleRate(): number {
    return this.settings.devSampleRate / (1 << this.settings.log2SoftDecim);
  }

  getADCSampleRate(): number {
    return this.settings.devSampleRate * (1 << this.settings.log2HardDecim);
  }

  setDCBlock() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setNCOEnable() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    this.centerFreqKhz = this.loFreqKhz + (this.ncoEnable ? this.ncoFreqKhz : 0);
    newSettings.ncoEnable = this.ncoEnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    this.loFreqKhz = this.centerFreqKhz - (this.ncoEnable ? this.ncoFreqKhz : 0);
    newSettings.centerFrequency = this.loFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setNCOFrequency() {
    this.validateNCOFrequency();
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    this.centerFreqKhz = this.loFreqKhz + (this.ncoEnable ? this.ncoFreqKhz : 0);
    newSettings.ncoFrequency = this.ncoFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  validateNCOFrequency() {
    let min, max: number;
    min = -this.getADCSampleRate() / 2000;
    max = this.getADCSampleRate() / 2000;
    if (this.ncoFreqKhz < min) {
      this.ncoFreqKhz = min;
    } else if (this.ncoFreqKhz > max) {
      this.ncoFreqKhz = max;
    }
  }

  validateLPFFrequency() {
    if (this.lpfBWkHz < 501) {
      this.lpfBWkHz = 501;
    } else if (this.lpfBWkHz > 130000) {
      this.lpfBWkHz = 130000;
    }
  }

  setAntennaPath() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.antennaPath = this.settings.antennaPath;
    this.setDeviceSettings(newSettings);
  }

  setDevSampleRate() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2HardDecim() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.log2HardDecim = this.settings.log2HardDecim;
    this.setDeviceSettings(newSettings);
  }

  setLog2SoftDecim() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.log2SoftDecim = this.settings.log2SoftDecim;
    this.setDeviceSettings(newSettings);
  }

  setLPFilter() {
    this.validateLPFFrequency();
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.lpfBW = this.lpfBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setGainMode() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.gainMode = this.settings.gainMode;
    this.setDeviceSettings(newSettings);
  }

  setPowerMode() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.pwrmode = this.settings.pwrmode;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setLNAGain() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.lnaGain = this.settings.lnaGain;
    this.setDeviceSettings(newSettings);
  }

  setTIAGain() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.tiaGain = this.settings.tiaGain;
    this.setDeviceSettings(newSettings);
  }

  setPGAGain() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.pgaGain = this.settings.pgaGain;
    this.setDeviceSettings(newSettings);
  }

  getFIFOFillPercentage(): number {
    if (this.report && this.report.fifoSize > 0) {
      return (this.report.fifoFill / this.report.fifoSize) * 100;
    } else {
      return 0;
    }
  }

  setUseReverseAPI() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: XTRXInputSettings = <XTRXInputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
