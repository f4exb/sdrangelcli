import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';
import { PerseusSettings, PERSEUS_SETTINGS_DEFAULT } from './perseus';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { Utils } from '../../common-components/utils';

interface Log2 {
  value: number;
  viewValue: number;
}

interface Attenuation {
  value: number;
  viewValue: number;
}

interface SampleRate {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-perseus',
  templateUrl: './perseus.component.html',
  styleUrls: ['./perseus.component.css']
})
export class PerseusComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  log2Decims: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
  ];
  attenuations: Attenuation[] = [
    {value: 0, viewValue: 0},
    {value: 1, viewValue: 10},
    {value: 2, viewValue: 20},
    {value: 3, viewValue: 30},
  ];
  sampleRates: SampleRate[] = [];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: PerseusSettings = PERSEUS_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  transverter: boolean;
  loPPM: number;
  wideband: boolean;
  dither: boolean;
  preamp: boolean;
  useReverseAPI: boolean;

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

  getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'Perseus') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.perseusSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.transverter = this.settings.transverterMode !== 0;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.wideband = this.settings.wideBand !== 0;
          this.dither = this.settings.adcDither !== 0;
          this.preamp = this.settings.adcPreamp !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a Perseus device';
          this.statusError = true;
        }
      }
    );
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceReport => {
        if (deviceReport.deviceHwType === 'Perseus') {
          this.statusMessage = 'OK';
          this.statusError = false;
          let i = 0;
          deviceReport.perseusReport.sampleRates.forEach(element => {
            this.sampleRates.push({value: i, viewValue: element.rate});
            i += 1;
          });
        } else {
          this.statusMessage = 'Not a Perseus device';
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

  private setDeviceSettings(perseusSettings: PerseusSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'Perseus';
    settings.direction = 0,
    settings.perseusSettings = perseusSettings;
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

  getSampleRate(): number {
    if (this.settings.devSampleRateIndex < this.sampleRates.length) {
      return this.sampleRates[this.settings.devSampleRateIndex].viewValue / (1 << this.settings.log2Decim);
    } else {
      return 48000;
    }
  }

  setLoPPM() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setAttenuator() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.attenuator = this.settings.attenuator;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.devSampleRateIndex = this.settings.devSampleRateIndex;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 10) {
      this.centerFreqKhz = 10;
    } else if (this.centerFreqKhz > 40000) {
      this.centerFreqKhz = 40000;
    }
  }

  setDither() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.adcDither = this.dither ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setPreamp() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.adcPreamp = this.preamp ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setWideband() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.wideBand = this.wideband ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: PerseusSettings = <PerseusSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
