import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { BladeRF1OutputSettings, BLADERF1_OUTPUT_SETTINGS_DEFAULT } from './bladerf1-output';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Utils } from 'src/app/common-components/utils';

export interface Bandwidth {
  value: number;
  viewValue: number;
}

export interface Log2Interp {
  value: number;
  viewValue: number;
}

export interface FcPos {
  value: number;
  viewValue: string;
}

export interface Xb200Filter {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-bladerf1-output',
  templateUrl: './bladerf1-output.component.html',
  styleUrls: ['./bladerf1-output.component.css']
})
export class Bladerf1OutputComponent implements OnInit {
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
  bandwidths: Bandwidth[] = [
    {value: 1500000, viewValue: 1.5},
    {value: 1750000, viewValue: 1.75},
    {value: 2500000, viewValue: 2.5},
    {value: 2750000, viewValue: 2.75},
    {value: 3000000, viewValue: 3},
    {value: 3840000, viewValue: 3.84},
    {value: 5000000, viewValue: 5},
    {value: 5500000, viewValue: 5.5},
    {value: 6000000, viewValue: 6},
    {value: 7000000, viewValue: 7},
    {value: 8750000, viewValue: 8.75},
    {value: 10000000, viewValue: 10},
    {value: 12000000, viewValue: 12},
    {value: 14000000, viewValue: 14},
    {value: 20000000, viewValue: 20},
    {value: 28000000, viewValue: 28}
  ];
  xb200Filters: Xb200Filter[] = [
    {value: 0, viewValue: 'None'},
    {value: 1, viewValue: 'Bypass'},
    {value: 2, viewValue: '50 MHz'},
    {value: 3, viewValue: '144 MHz'},
    {value: 4, viewValue: '222 MHz'},
    {value: 5, viewValue: 'Custom'},
    {value: 6, viewValue: 'Auto 1dB'},
    {value: 7, viewValue: 'Auto 3dB'}
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: BladeRF1OutputSettings = BLADERF1_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  bandwidthIndex: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  xb200FilterIndex: number;
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
      this.getDeviceSettings();
    });
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === 'BladeRF1') && deviceSettings.tx !== 0) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.bladeRF1OutputSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.setXb200FilterIndex();
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a BladeRF1 output device';
          this.statusError = true;
        }
      }
    );
  }

  private setXb200FilterIndex() {
    if (this.settings.xb200 !== 0) {
      if (this.settings.xb200Path === 0) {
        this.xb200FilterIndex = 1; // bypass
      } else {
        this.xb200FilterIndex = this.settings.xb200Filter + 2;
      }
    } else {
      this.xb200FilterIndex = 0; // none
    }
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.getSampleRate()
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(bladeRF1Settings: BladeRF1OutputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'BladeRF1';
    settings.tx = 1,
    settings.bladeRF1OutputSettings = bladeRF1Settings;
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

  setBandwidth() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.bandwidth = this.settings.bandwidth;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 0) {
      this.centerFreqKhz = 0;
    } else if (this.centerFreqKhz > 38000000) {
      this.centerFreqKhz = 38000000;
    }
  }

  setLog2Interp() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.log2Interp = this.settings.log2Interp;
    this.setDeviceSettings(newSettings);
  }
  setVga1() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.vga1 = this.settings.vga1;
    this.setDeviceSettings(newSettings);
  }

  setVga2() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.vga2 = this.settings.vga2;
    this.setDeviceSettings(newSettings);
  }

  setXb200() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.xb200 = this.xb200FilterIndex  === 0 ? 0 : 1;
    if (this.xb200FilterIndex > 1) { // actual filters
      newSettings.xb200Filter = this.xb200FilterIndex - 2;
      newSettings.xb200Path = 1; // activate mixer
    } else {
      newSettings.xb200Path = 0; // de-activate mixer
    }
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: BladeRF1OutputSettings = <BladeRF1OutputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
