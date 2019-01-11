import { Component, OnInit } from '@angular/core';
import { BLADERF2_SETTINGS_DEFAULT, BladeRF2Settings } from './bladerf2-input';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Utils } from 'src/app/common-components/utils';
import { Subscription } from 'rxjs';

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface FcPos {
  value: number;
  viewValue: string;
}

export interface GainMode {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-bladerf2-input',
  templateUrl: './bladerf2-input.component.html',
  styleUrls: ['./bladerf2-input.component.css']
})
export class Bladerf2InputComponent implements OnInit {
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
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  gainModes: GainMode[];
  deviceIndex: number;
  sdrangelURL: string;
  settings: BladeRF2Settings = BLADERF2_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  bandwidthKhz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
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
      this.getDeviceReport();
      this.getDeviceSettings();
    });
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'BladeRF2') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.bladeRF2InputSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.bandwidthKhz = this.settings.bandwidth / 1000;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.transverterMode = this.settings.transverterMode !== 0;
          this.biasTee = this.settings.biasTee !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a BladeRF2 device';
          this.statusError = true;
        }
      }
    );
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'BladeRF2') {
          this.statusMessage = 'OK';
          this.statusError = false;
          const reportedGainModes = deviceSettings.bladeRF2InputReport['gainModes'];
          this.gainModes = [];
          reportedGainModes.forEach(element => {
            const reportedGainModeName = element['name'];
            const reportedGainModeIndex = element['value'];
            this.gainModes.push({value: reportedGainModeIndex, viewValue: reportedGainModeName});
          });
        } else {
          this.statusMessage = 'Not a BladeRF2 device';
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

  private setDeviceSettings(bladeRF2Settings: BladeRF2Settings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'BladeRF2';
    settings.tx = 0,
    settings.bladeRF2InputSettings = bladeRF2Settings;
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
    return this.settings.devSampleRate / (1 << this.settings.log2Decim);
  }

  setSampleRate() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setBandwidth() {
    this.validateBandwidthKhz();
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
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
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
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

  setGainMode() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.gainMode = this.settings.gainMode;
    this.setDeviceSettings(newSettings);
  }

  setGlobalGain() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.globalGain = this.settings.globalGain;
    this.setDeviceSettings(newSettings);
  }

  setLoPPM() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBiasTee() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.biasTee = this.biasTee ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.transverterMode = this.transverterMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: BladeRF2Settings = <BladeRF2Settings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
