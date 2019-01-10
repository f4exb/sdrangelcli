import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';
import { AirspySettings, AIRSPY_SETTINGS_DEFAULT } from './airspy';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Utils } from 'src/app/common-components/utils';

export interface SampleRate {
  value: number;
  viewValue: number;
}

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface FcPos {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-airspy',
  templateUrl: './airspy.component.html',
  styleUrls: ['./airspy.component.css']
})
export class AirspyComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  fcPositions: FcPos[] = [
    {value: 0, viewValue: 'Inf'},
    {value: 1, viewValue: 'Sup'},
    {value: 2, viewValue: 'Cen'},
  ];
  sampleRates: SampleRate[] = [];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: AirspySettings = AIRSPY_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  transverter: boolean;
  lnaAGC: boolean;
  mixerAGC: boolean;
  biasT: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getDeviceReport();
      this.getDeviceSettings();
    });
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'Airspy') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.airspySettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.transverter = this.settings.transverterMode !== 0;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.lnaAGC = this.settings.lnaAGC !== 0;
          this.mixerAGC = this.settings.mixerAGC !== 0;
          this.biasT = this.settings.biasT !== 0;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not an Airspy device';
          this.statusError = true;
        }
      }
    );
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceReport => {
        if (deviceReport.deviceHwType === 'Airspy') {
          this.statusMessage = 'OK';
          this.statusError = false;
          let i = 0;
          deviceReport.airspyReport.sampleRates.forEach(element => {
            this.sampleRates.push({value: i, viewValue: element.rate});
            i += 1;
          });
        } else {
          this.statusMessage = 'Not an Airspy device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.getSampleRate()
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  getSampleRate(): number {
    if (this.settings.devSampleRateIndex < this.sampleRates.length) {
      return this.sampleRates[this.settings.devSampleRateIndex].viewValue / (1 << this.settings.log2Decim);
    } else {
      return 6000000;
    }
  }

  private setDeviceSettings(airspySettings: AirspySettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'Airspy';
    settings.tx = 0,
    settings.airspySettings = airspySettings;
    this.devicedetailsService.setSettings(this.sdrangelURL, this.deviceIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        Utils.delayObservable(1000).subscribe(
          _ => { this.getDeviceSettings(); }
        );
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  setLoPPM() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBiasT() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.biasT = this.biasT ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 24000) {
      this.centerFreqKhz = 24000;
    } else if (this.centerFreqKhz > 19000000) {
      this.centerFreqKhz = 19000000;
    }
  }

  setLog2Decim() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setLnaAGC() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.lnaAGC = this.lnaAGC ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setMixerAGC() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.mixerAGC = this.mixerAGC ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setSampleRateIndex() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.devSampleRateIndex = this.settings.devSampleRateIndex;
    this.setDeviceSettings(newSettings);
  }

  setLnaGain() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.lnaGain = this.settings.lnaGain;
    this.setDeviceSettings(newSettings);
  }

  setMixerGain() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.mixerGain = this.settings.mixerGain;
    this.setDeviceSettings(newSettings);
  }

  setVgaGain() {
    const newSettings: AirspySettings = <AirspySettings>{};
    newSettings.vgaGain = this.settings.vgaGain;
    this.setDeviceSettings(newSettings);
  }
}
