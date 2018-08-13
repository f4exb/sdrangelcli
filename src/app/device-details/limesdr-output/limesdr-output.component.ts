import { Component, OnInit } from '@angular/core';
import { LimeSDROutputReport, LIMESDR_OUTPUT_REPORT_DEFAULT, LimeSDROutputSettings, LIMESDR_OUTPUT_SETTINGS_DEFAULT } from './limesdr-output';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';

interface Log2 {
  value: number,
  viewValue: number
}

interface AntennaPath {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-limesdr-output',
  templateUrl: './limesdr-output.component.html',
  styleUrls: ['./limesdr-output.component.css']
})
export class LimesdrOutputComponent implements OnInit {
  antennaPaths: AntennaPath[] = [
    {value: 0, viewValue: "None"},
    {value: 1, viewValue: "Low"},
    {value: 2, viewValue: "High"},
  ];
  softInterps: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  hardInterps: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex : number;
  sdrangelURL : string;
  report: LimeSDROutputReport = LIMESDR_OUTPUT_REPORT_DEFAULT;
  settings: LimeSDROutputSettings = LIMESDR_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  ncoFreqKhz: number;
  lpfBWkHz: number;
  lpfFIRBWkHz: number;
  extClockFreqKhz: number;
  extClock: boolean;
  lpfFIREnable: boolean;
  ncoEnable: boolean;
  transverterMode: boolean;
  monitor: boolean;
  statusMessage: string;
  statusError: boolean = false;
  deviceReportSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService)
  {
    this.monitor = false;
    this.deviceReportSubscription = null;
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix']
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getDeviceSettings();
    });
  }

  ngOnDestroy() {
    (this.deviceReportSubscription) && this.deviceReportSubscription.unsubscribe();
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === "LimeSDR") && (deviceSettings.tx === 1)) {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.limeSdrOutputSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.ncoFreqKhz = this.settings.ncoFrequency/1000;
          this.lpfBWkHz = this.settings.lpfBW/1000;
          this.lpfFIRBWkHz = this.settings.lpfFIRBW/1000;
          this.extClockFreqKhz = this.settings.extClockFreq/1000;
          this.extClock = this.settings.extClock !== 0;
          this.lpfFIREnable = this.settings.lpfFIREnable !== 0;
          this.ncoEnable = this.settings.ncoEnable !== 0;
          this.transverterMode = this.settings.transverterMode !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = "Not a LimeSDR output device";
          this.statusError = true;
        }
      }
    )
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            deviceReport => {
              if ((deviceReport.deviceHwType === "LimeSDR") && (deviceReport.tx === 1)) {
                this.report = deviceReport.limeSdrOutputReport;
              }
            }
          )
        }
      )
    } else {
      this.deviceReportSubscription.unsubscribe();
      this.deviceReportSubscription = null;
    }
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate/(1<<this.settings.log2SoftInterp)
    }
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(limeSDRSettings : LimeSDROutputSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "LimeSDR";
    settings.tx = 1,
    settings.limeSdrOutputSettings = limeSDRSettings;
    this.devicedetailsService.setSettings(this.sdrangelURL, this.deviceIndex, settings).subscribe(
      res => {
        console.log("Set settings OK", res);
        this.statusMessage = "OK";
        this.statusError = false;
        this.getDeviceSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    )
  }

  getSampleRate() : number {
    return this.settings.devSampleRate/(1<<this.settings.log2SoftInterp);
  }

  getDACSampleRate() : number {
    return this.settings.devSampleRate*(1<<this.settings.log2HardInterp);
  }

  setNCOEnable() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.ncoEnable = this.ncoEnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setNCOFrequency() {
    this.validateNCOFrequency();
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.ncoFrequency = this.ncoFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  validateNCOFrequency() {
    let min, max : number;
    min = -this.getDACSampleRate()/2000;
    max = this.getDACSampleRate()/2000;
    if (this.ncoFreqKhz < min) {
      this.ncoFreqKhz = min;
    } else if (this.ncoFreqKhz > max) {
      this.ncoFreqKhz = max;
    }
  }

  setAntennaPath() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.antennaPath = this.settings.antennaPath;
    this.setDeviceSettings(newSettings);
  }

  setDevSampleRate() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2HardInterp() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.log2HardInterp = this.settings.log2HardInterp;
    this.setDeviceSettings(newSettings);
  }

  setLog2SoftInterp() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.log2SoftInterp = this.settings.log2SoftInterp;
    this.setDeviceSettings(newSettings);
  }

  setLPFilter() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.lpfBW = this.lpfBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLPFIREnable() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.lpfFIREnable = this.lpfFIREnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLPFIRFilter() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.lpfFIRBW = this.lpfFIRBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.transverterMode = this.transverterMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: LimeSDROutputSettings = <LimeSDROutputSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  getFIFOFillPercentage() : number {
    if (this.report && this.report.fifoSize > 0) {
      return (this.report.fifoFill/this.report.fifoSize)*100
    } else {
      return 0;
    }
  }

}
