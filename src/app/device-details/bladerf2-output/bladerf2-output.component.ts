import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { BladeRF2OutputSettings, BLADERF2_OUTPUT_SETTINGS_DEFAULT } from './bladerf2-output';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Utils } from 'src/app/common-components/utils';
import { Subscription } from 'rxjs';

export interface Log2Interp {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-bladerf2-output',
  templateUrl: './bladerf2-output.component.html',
  styleUrls: ['./bladerf2-output.component.css']
})
export class Bladerf2OutputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  log2Interps: Log2Interp[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: BladeRF2OutputSettings = BLADERF2_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  bandwidthKhz: number;
  loPPM: number;
  useReverseAPI: boolean;
  transverterMode: boolean;
  biasTee: boolean;
  monitor: boolean;
  deviceReportSubscription: Subscription;

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
        if ((deviceSettings.deviceHwType === 'BladeRF2') && (deviceSettings.tx !== 0)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.bladeRF2OutputSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.bandwidthKhz = this.settings.bandwidth / 1000;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.transverterMode = this.settings.transverterMode !== 0;
          this.biasTee = this.settings.biasTee !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a BladeRF2 output device';
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

  private setDeviceSettings(bladeRF2Settings: BladeRF2OutputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'BladeRF2';
    settings.tx = 1,
    settings.bladeRF2OutputSettings = bladeRF2Settings;
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
    return this.settings.devSampleRate / (1 << this.settings.log2Interp);
  }

  setSampleRate() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setBandwidth() {
    this.validateBandwidthKhz();
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.bandwidth = this.bandwidthKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateBandwidthKhz() {
    if (this.bandwidthKhz < 200) {
      this.bandwidthKhz = 200;
    } else if (this.bandwidthKhz > 56000) {
      this.bandwidthKhz = 56000;
    }
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 70000) {
      this.centerFreqKhz = 70000;
    } else if (this.centerFreqKhz > 60000000) {
      this.centerFreqKhz = 60000000;
    }
  }

  setGlobalGain() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.globalGain = this.settings.globalGain;
    this.setDeviceSettings(newSettings);
  }

  setLoPPM() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setLog2Interp() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.log2Interp = this.settings.log2Interp;
    this.setDeviceSettings(newSettings);
  }

  setBiasTee() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.biasTee = this.biasTee ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.transverterMode = this.transverterMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: BladeRF2OutputSettings = <BladeRF2OutputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
