import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { SDRplaySettings, SDRPLAY_SETTINGS_DEFAULT } from './sdrplay';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface FcPos {
  value: number;
  viewValue: string;
}

export interface EnumInt {
  value: number;
  viewValue: number;
}

export interface EnumStr {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-sdrplay',
  templateUrl: './sdrplay.component.html',
  styleUrls: ['./sdrplay.component.css']
})
export class SdrplayComponent implements OnInit {
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
  sampleRates: EnumInt[] = [
    {value: 0, viewValue: 1536000}
  ];
  intermediateFrequencies: EnumInt[] = [
    {value: 0, viewValue: 0}
  ];
  bandwidths: EnumInt[] = [
    {value: 0, viewValue: 200}
  ];
  frequencyBandNames: EnumStr[] = [
    {value: 0, viewValue: '10k-12M'}
  ];
  frequencyBandMins: EnumInt[] = [
    {value: 0, viewValue: 10}
  ];
  frequencyBandMaxs: EnumInt[] = [
    {value: 0, viewValue: 12000}
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: SDRplaySettings = SDRPLAY_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  tunerGainMode: boolean;
  lnaOn: boolean;
  mixerAmpOn: boolean;
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
        if (deviceSettings.deviceHwType === 'SDRplay1') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.sdrPlaySettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.tunerGainMode = this.settings.tunerGainMode !== 0;
          this.lnaOn = this.settings.lnaOn !== 0;
          this.mixerAmpOn = this.settings.mixerAmpOn !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a SDRplay RSP1 device';
          this.statusError = true;
        }
      }
    );
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'SDRplay1') {
          this.statusMessage = 'OK';
          this.statusError = false;
          let i = 0;
          const reportedSampleRates = deviceSettings.sdrPlayReport['sampleRates'];
          this.sampleRates = [];
          reportedSampleRates.forEach(element => {
            const reportedRate = element['rate'];
            this.sampleRates.push({value: i, viewValue: reportedRate});
            i++;
          });
          i = 0;
          const reportedBandwidths = deviceSettings.sdrPlayReport['bandwidths'];
          this.bandwidths = [];
          reportedBandwidths.forEach(element => {
            const reportedBandwidth = element['bandwidth'];
            this.bandwidths.push({value: i, viewValue: reportedBandwidth / 1000});
            i++;
          });
          i = 0;
          const reportedIFs = deviceSettings.sdrPlayReport['intermediateFrequencies'];
          this.intermediateFrequencies = [];
          reportedIFs.forEach(element => {
            const reportedIF = element['frequency'];
            this.intermediateFrequencies.push({value: i, viewValue: reportedIF / 1000});
            i++;
          });
          i = 0;
          const reportedFrequencyBands = deviceSettings.sdrPlayReport['frequencyBands'];
          this.frequencyBandNames = [];
          this.frequencyBandMins = [];
          this.frequencyBandMaxs = [];
          reportedFrequencyBands.forEach(element => {
            const reportedFrequencyBandName = element['name'];
            const reportedFrequencyBandMin = element['lowerBound'];
            const reportedFrequencyBandMax = element['higherBound'];
            this.frequencyBandNames.push({value: i, viewValue: reportedFrequencyBandName});
            this.frequencyBandMins.push({value: i, viewValue: reportedFrequencyBandMin / 1000});
            this.frequencyBandMaxs.push({value: i, viewValue: reportedFrequencyBandMax / 1000});
            i++;
          });
        } else {
          this.statusMessage = 'Not a SDRplay RSP1 device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.sampleRates[this.settings.devSampleRateIndex].viewValue / (1 << this.settings.log2Decim)
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(sdrPlaySettings: SDRplaySettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'SDRplay1';
    settings.direction = 0,
    settings.sdrPlaySettings = sdrPlaySettings;
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
    return this.sampleRates[this.settings.devSampleRateIndex].viewValue / (1 << this.settings.log2Decim);
  }

  setLoPPM() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setAutoGain() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.tunerGainMode = this.tunerGainMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTunerGain() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.tunerGain = this.settings.tunerGain;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLNA() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.lnaOn = this.lnaOn ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setMixer() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.mixerAmpOn = this.mixerAmpOn ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBasebandGain() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.basebandGain = this.settings.basebandGain;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    let min, max: number;
    min = this.frequencyBandMins[this.settings.frequencyBandIndex].viewValue;
    max = this.frequencyBandMaxs[this.settings.frequencyBandIndex].viewValue;
    if (this.centerFreqKhz < min) {
      this.centerFreqKhz = min;
    } else if (this.centerFreqKhz > max) {
      this.centerFreqKhz = max;
    }
  }

  getMinFrequency() {
    return this.frequencyBandMins[this.settings.frequencyBandIndex].viewValue;
  }

  getMaxFrequency() {
    return this.frequencyBandMaxs[this.settings.frequencyBandIndex].viewValue;
  }

  setSampleRateIndex() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.devSampleRateIndex = this.settings.devSampleRateIndex;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setBandIndex() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.frequencyBandIndex = this.settings.frequencyBandIndex;
    this.setDeviceSettings(newSettings);
  }

  setBandwidthIndex() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.bandwidthIndex = this.settings.bandwidthIndex;
    this.setDeviceSettings(newSettings);
  }

  setIntermediateFrequencyIndex() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.ifFrequencyIndex = this.settings.ifFrequencyIndex;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: SDRplaySettings = <SDRplaySettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

}
