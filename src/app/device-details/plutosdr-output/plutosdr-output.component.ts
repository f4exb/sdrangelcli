import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';
import { PlutoSDROutputReport, PLUTOSDR_OUTPUT_REPORT_DEFAULT, PlutoSDROutputSettings, PLUTOSDR_OUTPUT_SETTINGS_DEFAULT } from './plutosdr-output';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';

interface Log2 {
  value: number;
  viewValue: number;
}

interface AntennaPath {
  value: number;
  viewValue: string;
}

interface FIRGain {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-plutosdr-output',
  templateUrl: './plutosdr-output.component.html',
  styleUrls: ['./plutosdr-output.component.css']
})
export class PlutosdrOutputComponent implements OnInit {
  antennaPaths: AntennaPath[] = [
    {value: 0, viewValue: 'A'},
    {value: 1, viewValue: 'B'},
  ];
  softInterps: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
  ];
  hardInterps: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
  ];
  firGains: FIRGain[] = [
    {value: -6, viewValue: -6},
    {value: 0, viewValue: 0},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  report: PlutoSDROutputReport = PLUTOSDR_OUTPUT_REPORT_DEFAULT;
  settings: PlutoSDROutputSettings = PLUTOSDR_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  lpfBWkHz: number;
  lpfFIRBWkHz: number;
  lpfFIREnable: boolean;
  loPPMCorrection: number;
  attenuationDb: number;
  transverterMode: boolean;
  monitor: boolean;
  statusMessage: string;
  statusError = false;
  deviceReportSubscription: Subscription;
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
      this.monitor = false;
      this.deviceReportSubscription = null;
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
        if ((deviceSettings.deviceHwType === 'PlutoSDR') && (deviceSettings.tx === 1)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.plutoSdrOutputSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.lpfBWkHz = this.settings.lpfBW / 1000;
          this.lpfFIRBWkHz = this.settings.lpfFIRBW / 1000;
          this.loPPMCorrection = this.settings.LOppmTenths / 10;
          this.lpfFIREnable = this.settings.lpfFIREnable !== 0;
          this.attenuationDb = this.settings.att / 4;
          this.transverterMode = this.settings.transverterMode !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a PlutoSDR output device';
          this.statusError = true;
        }
      }
    );
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            devicelReport => {
              if ((devicelReport.deviceHwType === 'PlutoSDR') && (devicelReport.tx === 1)) {
                this.report = devicelReport.plutoSdrOutputReport;
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

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate / (1 << this.settings.log2Interp)
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(plutoSDRSettings: PlutoSDROutputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'PlutoSDR';
    settings.tx = 1,
    settings.plutoSdrOutputSettings = plutoSDRSettings;
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
    return this.settings.devSampleRate / (1 << this.settings.log2Interp);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAntennaPath() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.antennaPath = this.settings.antennaPath;
    this.setDeviceSettings(newSettings);
  }

  setDevSampleRate() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2SoftInterp() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.log2Interp = this.settings.log2Interp;
    this.setDeviceSettings(newSettings);
  }

  setLog2HardInterp() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.lpfFIRlog2Interp = this.settings.lpfFIRlog2Interp;
    this.setDeviceSettings(newSettings);
  }

  setLPFilter() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.lpfBW = this.lpfBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLPFIREnable() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.lpfFIREnable = this.lpfFIREnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLPFIRFilter() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.lpfFIRBW = this.lpfFIRBWkHz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAttenuation() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.att = this.attenuationDb * 4;
    this.setDeviceSettings(newSettings);
  }

  setFIRGain() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.lpfFIRGain = this.settings.lpfFIRGain;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.transverterMode = this.transverterMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setLoPPM() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.LOppmTenths = this.loPPMCorrection * 10;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: PlutoSDROutputSettings = <PlutoSDROutputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
