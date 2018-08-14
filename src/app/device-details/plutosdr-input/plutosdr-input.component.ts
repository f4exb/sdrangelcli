import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';
import { PlutoSDRInputReport, PLUTOSDR_INPUT_REPORT_DEFAULT, PlutoSDRInputSettings, PLUTOSDR_INPUT_SETTINGS_DEFAULT } from './plutosdr-input';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';

interface Log2 {
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

interface FcPos {
  value: number,
  viewValue: string
}

interface FIRGain {
  value: number,
  viewValue: number
}

@Component({
  selector: 'app-plutosdr-input',
  templateUrl: './plutosdr-input.component.html',
  styleUrls: ['./plutosdr-input.component.css']
})
export class PlutosdrInputComponent implements OnInit {
  antennaPaths: AntennaPath[] = [
    {value: 0, viewValue: "ABal"},
    {value: 1, viewValue: "BBal"},
    {value: 2, viewValue: "CBal"},
    {value: 3, viewValue: "An"},
    {value: 4, viewValue: "Ap"},
    {value: 5, viewValue: "Bn"},
    {value: 6, viewValue: "Bp"},
    {value: 7, viewValue: "Cn"},
    {value: 8, viewValue: "Cp"},
    {value: 9, viewValue: "Tx1"},
    {value: 10, viewValue: "Tx2"},
    {value: 11, viewValue: "Tx3"},
  ];
  gainModes: GainMode[] = [
    {value: 0, viewValue: "Manual"},
    {value: 1, viewValue: "Slow"},
    {value: 2, viewValue: "Fast"},
    {value: 3, viewValue: "Hybrid"},
  ];
  softDecims: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  hardDecims: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
  ];
  fcPositions: FcPos[] = [
    {value: 0, viewValue: "Inf"},
    {value: 1, viewValue: "Sup"},
    {value: 2, viewValue: "Cen"},
  ];
  firGains: FIRGain[] = [
    {value: -12, viewValue: -12},
    {value: -6, viewValue: -6},
    {value: 0, viewValue: 0},
    {value: 6, viewValue: 6},
  ]
  frequencySteps : FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex : number;
  sdrangelURL : string;
  report: PlutoSDRInputReport = PLUTOSDR_INPUT_REPORT_DEFAULT;
  settings: PlutoSDRInputSettings = PLUTOSDR_INPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  lpfBWkHz: number;
  lpfFIRBWkHz: number;
  loPPMCorrection: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  lpfFIREnable: boolean;
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
        if ((deviceSettings.deviceHwType === "PlutoSDR") && (deviceSettings.tx === 0)) {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.plutoSdrInputSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.lpfBWkHz = this.settings.lpfBW/1000;
          this.lpfFIRBWkHz = this.settings.lpfFIRBW/1000;
          this.loPPMCorrection = this.settings.LOppmTenths/10;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.lpfFIREnable = this.settings.lpfFIREnable !== 0;
          this.transverterMode = this.settings.transverterMode !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = "Not a PlutoSDR input device";
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
              if ((devicelReport.deviceHwType === "PlutoSDR") && (devicelReport.tx === 0)) {
                this.report = devicelReport.plutoSdrInputReport;
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
      basebandRate: this.settings.devSampleRate/(1<<this.settings.log2Decim)
    }
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(plutoSDRSettings : PlutoSDRInputSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "PlutoSDR";
    settings.tx = 0,
    settings.plutoSdrInputSettings = plutoSDRSettings;
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
    return this.settings.devSampleRate/(1<<this.settings.log2Decim);
  }

  setDCBlock() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz*1000;
    this.setDeviceSettings(newSettings);
  }

  setAntennaPath() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.antennaPath = this.settings.antennaPath;
    this.setDeviceSettings(newSettings);
  }

  setDevSampleRate() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2SoftDecim() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setLog2HardDecim() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.lpfFIRlog2Decim = this.settings.lpfFIRlog2Decim;
    this.setDeviceSettings(newSettings);
  }

  setLPFilter() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.lpfBW = this.lpfBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLPFIREnable() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.lpfFIREnable = this.lpfFIREnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLPFIRFilter() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.lpfFIRBW = this.lpfFIRBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setGainMode() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.gainMode = this.settings.gainMode;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setFIRGain() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.lpfFIRGain = this.settings.lpfFIRGain;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.transverterMode = this.transverterMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setLoPPM() {
    const newSettings: PlutoSDRInputSettings = <PlutoSDRInputSettings>{};
    newSettings.LOppmTenths = this.loPPMCorrection*10;
    this.setDeviceSettings(newSettings);
  }
}
