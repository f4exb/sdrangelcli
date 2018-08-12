import { Component, OnInit } from '@angular/core';
import { LimeSDRInputSettings, LimeSDRInputReport, LIMESDR_INPUT_REPORT_DEFAULT, LIMESDR_INPUT_SETTINGS_DEFAULT } from './limesdr-input';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Subscription, interval } from 'rxjs';
import { DeviceSettings } from '../device-details';

interface Log2Decim {
  value: number,
  viewValue: number
}

interface AntennaPath {
  value: number,
  viewValue: string
}

interface GainMode {
  value: number,
  viewValue: string
}


@Component({
  selector: 'app-limesdr-input',
  templateUrl: './limesdr-input.component.html',
  styleUrls: ['./limesdr-input.component.css']
})
export class LimesdrInputComponent implements OnInit {
  antennaPaths: AntennaPath[] = [
    {value: 0, viewValue: "None"},
    {value: 1, viewValue: "High"},
    {value: 2, viewValue: "Low"},
    {value: 3, viewValue: "Wide"},
    {value: 4, viewValue: "LB1"},
    {value: 5, viewValue: "LB1"},
  ]
  gainModes: GainMode[] = [
    {value: 0, viewValue: "Auto"},
    {value: 1, viewValue: "Manual"},
  ]
  softDecims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ]
  hardDecims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ]
  deviceIndex : number;
  sdrangelURL : string;
  report: LimeSDRInputReport = LIMESDR_INPUT_REPORT_DEFAULT;
  settings: LimeSDRInputSettings = LIMESDR_INPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  ncoFreqKhz: number;
  lpfBWkHz: number;
  lpfFIRBWkHz: number;
  extClockFreqKhz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
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
        if ((deviceSettings.deviceHwType === "LimeSDR") && (deviceSettings.tx === 0)) {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.limeSdrInputSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.ncoFreqKhz = this.settings.ncoFrequency/1000;
          this.lpfBWkHz = this.settings.lpfBW/1000;
          this.lpfFIRBWkHz = this.settings.lpfFIRBW/1000;
          this.extClockFreqKhz = this.settings.extClockFreq/1000;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.extClock = this.settings.extClock !== 0;
          this.lpfFIREnable = this.settings.lpfFIREnable !== 0;
          this.ncoEnable = this.settings.ncoEnable !== 0;
          this.transverterMode = this.settings.transverterMode !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = "Not a LimeSDR input device";
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
            devicelReport => {
              if ((devicelReport.deviceHwType === "LimeSDR") && (devicelReport.tx === 0)) {
                this.report = devicelReport.limeSdrInputReport;
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
      basebandRate: this.settings.devSampleRate/(1<<this.settings.log2SoftDecim)
    }
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(limeSDRSettings : LimeSDRInputSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "LimeSDR";
    settings.tx = 0,
    settings.limeSdrInputSettings = limeSDRSettings;
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
    return this.settings.devSampleRate/(1<<this.settings.log2SoftDecim);
  }

  getADCSampleRate() : number {
    return this.settings.devSampleRate*(1<<this.settings.log2HardDecim);
  }

  setDCBlock() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setNCOEnable() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.ncoEnable = this.ncoEnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setCenterFrequency() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setNCOFrequency() {
    this.validateNCOFrequency();
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.ncoFrequency = this.ncoFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  validateNCOFrequency() {
    let min, max : number;
    min = -this.getADCSampleRate()/2000;
    max = this.getADCSampleRate()/2000;
    if (this.ncoFreqKhz < min) {
      this.ncoFreqKhz = min;
    } else if (this.ncoFreqKhz > max) {
      this.ncoFreqKhz = max;
    }
  }

  setAntennaPath() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.antennaPath = this.settings.antennaPath;
    this.setDeviceSettings(newSettings);
  }

  setDevSampleRate() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2HardDecim() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.log2HardDecim = this.settings.log2HardDecim;
    this.setDeviceSettings(newSettings);
  }

  setLog2SoftDecim() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.log2SoftDecim = this.settings.log2SoftDecim;
    this.setDeviceSettings(newSettings);
  }

  setLPFilter() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.lpfBW = this.lpfBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLPFIREnable() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.lpfFIREnable = this.lpfFIREnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLPFIRFilter() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.lpfFIRBW = this.lpfFIRBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setGainMode() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.gainMode = this.settings.gainMode;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setLNAGain() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.lnaGain = this.settings.lnaGain;
    this.setDeviceSettings(newSettings);
  }

  setTIAGain() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.tiaGain = this.settings.tiaGain;
    this.setDeviceSettings(newSettings);
  }

  setPGAGain() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.pgaGain = this.settings.pgaGain;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.transverterMode = this.transverterMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: LimeSDRInputSettings = <LimeSDRInputSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  getFIFOFillPercentage() : number {
    if (this.report.fifoSize > 0) {
      return (this.report.fifoFill/this.report.fifoSize)*100
    } else {
      return 0;
    }
  }
}
