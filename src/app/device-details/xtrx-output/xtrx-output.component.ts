import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { XTRXOutputReport, XTRX_OUTPUT_REPORT_DEFAULT, XTRXOutputSettings, XTRX_OUTPUT_SETTINGS_DEFAULT } from './xtrx-output';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Subscription, interval } from 'rxjs';

export interface Log2Interp {
  value: number;
  viewValue: number;
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
  selector: 'app-xtrx-output',
  templateUrl: './xtrx-output.component.html',
  styleUrls: ['./xtrx-output.component.css']
})
export class XtrxOutputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  softInterps: Log2Interp[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  hardInterps: Log2Interp[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ];
  antennaPaths: AntennaPath[] = [
    {value: 3, viewValue: 'High'},
    {value: 4, viewValue: 'Wide'},
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
  report: XTRXOutputReport = XTRX_OUTPUT_REPORT_DEFAULT;
  settings: XTRXOutputSettings = XTRX_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loFreqKhz: number;
  ncoFreqKhz: number;
  lpfBWkHz: number;
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

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === 'XTRX') && (deviceSettings.tx !== 0)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.xtrxOutputSettings;
          this.ncoFreqKhz = this.settings.ncoFrequency / 1000;
          this.ncoEnable = this.settings.ncoEnable !== 0;
          this.loFreqKhz = this.settings.centerFrequency / 1000;
          this.centerFreqKhz = this.loFreqKhz + (this.ncoEnable ? this.ncoFreqKhz : 0);
          this.lpfBWkHz = this.settings.lpfBW / 1000;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.extClock = this.settings.extClock !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a XTRX output device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate / (1 << this.settings.log2SoftInterp)
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            deviceReport => {
              if ((deviceReport.deviceHwType === 'XTRX') && (deviceReport.tx !== 0)) {
                this.report = deviceReport.xtrxOutputReport;
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

  private setDeviceSettings(xtrxOutputSettings: XTRXOutputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'XTRX';
    settings.tx = 1,
    settings.xtrxOutputSettings = xtrxOutputSettings;
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
    return this.settings.devSampleRate / (1 << this.settings.log2SoftInterp);
  }

  getDACSampleRate(): number {
    return this.settings.devSampleRate * (1 << this.settings.log2HardInterp);
  }

  setNCOEnable() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    this.centerFreqKhz = this.loFreqKhz + (this.ncoEnable ? this.ncoFreqKhz : 0);
    newSettings.ncoEnable = this.ncoEnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    this.loFreqKhz = this.centerFreqKhz - (this.ncoEnable ? this.ncoFreqKhz : 0);
    newSettings.centerFrequency = this.loFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setNCOFrequency() {
    this.validateNCOFrequency();
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    this.centerFreqKhz = this.loFreqKhz + (this.ncoEnable ? this.ncoFreqKhz : 0);
    newSettings.ncoFrequency = this.ncoFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  validateNCOFrequency() {
    let min, max: number;
    min = -this.getDACSampleRate() / 2000;
    max = this.getDACSampleRate() / 2000;
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
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.antennaPath = this.settings.antennaPath;
    this.setDeviceSettings(newSettings);
  }

  setDevSampleRate() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2HardInterp() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.log2HardInterp = this.settings.log2HardInterp;
    this.setDeviceSettings(newSettings);
  }

  setLog2SoftInterp() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.log2SoftInterp = this.settings.log2SoftInterp;
    this.setDeviceSettings(newSettings);
  }

  setLPFilter() {
    this.validateLPFFrequency();
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.lpfBW = this.lpfBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setPowerMode() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.pwrmode = this.settings.pwrmode;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.gain = this.settings.gain;
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
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: XTRXOutputSettings = <XTRXOutputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
