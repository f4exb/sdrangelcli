import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AirspyHFSettings, AIRSPYHF_SETTINGS_DEFAULT } from './airspyhf';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';

export interface SampleRate {
  value: number;
  viewValue: number;
}

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface Band {
  value: number;
  viewValue: string;
}

export interface AttenuatorStep {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-airspyhf',
  templateUrl: './airspyhf.component.html',
  styleUrls: ['./airspyhf.component.css']
})
export class AirspyhfComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  sampleRates: SampleRate[] = [
    {value: 0, viewValue: 768}
  ];
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  bands: Band[] = [
    {value: 0, viewValue: 'HF'},
    {value: 1, viewValue: 'VHF'},
  ];
  attenuatorSteps: AttenuatorStep[] = [
    {value: 0, viewValue: 0},
    {value: 1, viewValue: 6},
    {value: 2, viewValue: 12},
    {value: 3, viewValue: 18},
    {value: 4, viewValue: 24},
    {value: 5, viewValue: 30},
    {value: 6, viewValue: 36},
    {value: 7, viewValue: 42},
    {value: 8, viewValue: 48},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: AirspyHFSettings = AIRSPYHF_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  transverter: boolean;
  useReverseAPI: boolean;
  useAGC: boolean;
  agcHigh: boolean;
  useDSP: boolean;
  useLNA: boolean;
  dcBlock: boolean;
  iqCorrection: boolean;

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
        if (deviceSettings.deviceHwType === 'AirspyHF') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.airspyHFSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.transverter = this.settings.transverterMode !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.useAGC = this.settings.useAGC !== 0;
          this.agcHigh = this.settings.agcHigh !== 0;
          this.useDSP = this.settings.useDSP !== 0;
          this.useLNA = this.settings.useLNA !== 0;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not an AirspyHF device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: 768000 / (1 << this.settings.log2Decim)
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(airspyhfSettings: AirspyHFSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'AirspyHF';
    settings.tx = 0,
    settings.airspyHFSettings = airspyhfSettings;
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
    return 768000 / (1 << this.settings.log2Decim);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLoPPMTenths() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setSampleRateIndex() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.devSampleRateIndex = this.settings.devSampleRateIndex;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setBandIndex() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.bandIndex = this.settings.bandIndex;
    this.validateCenterFrequencyKhz();
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setFileRecordName() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.fileRecordName = this.settings.fileRecordName;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    let min, max: number;
    if (this.settings.bandIndex === 0) {
      min = 9;
      max = 31000;
    } else {
      min = 60000;
      max = 260000;
    }
    if (this.centerFreqKhz < min) {
      this.centerFreqKhz = min;
    } else if (this.centerFreqKhz > max) {
      this.centerFreqKhz = max;
    }
  }

  setUseReverseAPI() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLNA() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.useLNA = this.useLNA ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setDSP() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.useDSP = this.useDSP ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAGC() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.useAGC = this.useAGC ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAGCHigh() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.agcHigh = this.agcHigh ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAttenuatorStep() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.attenuatorSteps = this.settings.attenuatorSteps;
    this.setDeviceSettings(newSettings);
  }
}
