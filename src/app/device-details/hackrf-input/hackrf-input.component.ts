import { Component, OnInit } from '@angular/core';
import { HackRFInputSettings, HACKRF_INPUT_SETTINGS_DEFAULT } from './hackrf-input';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from '../../common-components/frequency-dial/frequency-dial.component';

interface Log2Decim {
  value: number;
  viewValue: number;
}

interface FcPos {
  value: number;
  viewValue: string;
}

interface RFBandwidth {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-hackrf-input',
  templateUrl: './hackrf-input.component.html',
  styleUrls: ['./hackrf-input.component.css']
})
export class HackrfInputComponent implements OnInit {
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
  rfBandwidths: RFBandwidth[] = [
    {value: 1750000, viewValue: 1.75},
    {value: 2500000, viewValue: 2.5},
    {value: 3500000, viewValue: 3.5},
    {value: 5000000, viewValue: 5},
    {value: 5500000, viewValue: 5.5},
    {value: 6000000, viewValue: 6},
    {value: 7000000, viewValue: 7},
    {value: 8000000, viewValue: 8},
    {value: 9000000, viewValue: 9},
    {value: 10000000, viewValue: 10},
    {value: 12000000, viewValue: 12},
    {value: 14000000, viewValue: 14},
    {value: 15000000, viewValue: 15},
    {value: 20000000, viewValue: 20},
    {value: 24000000, viewValue: 24},
    {value: 28000000, viewValue: 28},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: HackRFInputSettings = HACKRF_INPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  loPPM: number;
  biasT: boolean;
  rfAmp: boolean;
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

  getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === 'HackRF') && (deviceSettings.direction === 0)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.hackRFInputSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.biasT = this.settings.biasT !== 0;
          this.rfAmp = this.settings.lnaExt !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a HackRF input device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate / (1 << this.settings.log2Decim)
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(hackrfSettings: HackRFInputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'HackRF';
    settings.direction = 0,
    settings.hackRFInputSettings = hackrfSettings;
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
    return this.settings.devSampleRate / (1 << this.settings.log2Decim);
  }

  setLoPPM() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.bandwidth = this.settings.bandwidth;
    this.setDeviceSettings(newSettings);
  }

  setBiasT() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.biasT = this.biasT ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setRFAmp() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.lnaExt = this.rfAmp ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLNAGain() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.lnaGain = this.settings.lnaGain;
    this.setDeviceSettings(newSettings);
  }

  setVGAGain() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.vgaGain = this.settings.vgaGain;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: HackRFInputSettings = <HackRFInputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
