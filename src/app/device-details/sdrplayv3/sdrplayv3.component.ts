import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { DeviceStorage, DeviceStoreService } from 'src/app/device-store.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceDetailsService } from '../device-details.service';
import { SDRplayV3Settings, SDRPLAYV3_SETTINGS_DEFAULT, SDRPLAYV3_ATT_FREQ_UP_BOUNDS, SDRPLAYV3_ATT, SDRPLAYV3_TUNERS, SDRPLAYV3_ANTENNAS } from './sdrplayv3';

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
  selector: 'app-sdrplayv3',
  templateUrl: './sdrplayv3.component.html',
  styleUrls: ['./sdrplayv3.component.css']
})
export class Sdrplayv3Component implements OnInit {
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
  deviceType: string;
  intermediateFrequencies: EnumInt[] = [
  ];
  bandwidths: EnumInt[] = [
  ];
  lnaValues: EnumInt[] = [
  ];
  tuners: EnumInt[] = [
  ];
  antennas: EnumStr[] = [
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: SDRplayV3Settings = SDRPLAYV3_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  ifAGC: boolean;
  ifGain: number;
  amNotch: boolean;
  fmNotch: boolean;
  dabNotch: boolean;
  biasTee: boolean;
  extRef: boolean;
  tunerIndex: number;
  antennaIndex: number;
  attBandIndex: number;
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
  }

  ngOnInit(): void {
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
        if (deviceSettings.deviceHwType === 'SDRplayV3') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.sdrPlayV3Settings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.attBandIndex = -1;
          this.setLNA(this.settings.centerFrequency, this.deviceType);
          this.loPPM = this.settings.LOppmTenths / 10;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.ifAGC = this.settings.ifAGC !== 0;
          this.ifGain = this.settings.ifGain;
          this.amNotch = this.settings.amNotch !== 0;
          this.fmNotch = this.settings.fmNotch !== 0;
          this.dabNotch = this.settings.dabNotch !== 0;
          this.biasTee = false; // TODO: get it from settings
          this.extRef = this.settings.extRef !== 0;
          this.tunerIndex = this.settings.tuner;
          this.antennaIndex = this.settings.antenna;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a SDRplay V3 device';
          this.statusError = true;
        }
      }
    );
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'SDRplayV3') {
          this.statusMessage = 'OK';
          this.statusError = false;
          let i = 0;
          const reportedBandwidths = deviceSettings.sdrPlayV3Report['bandwidths'];
          this.bandwidths = [];
          reportedBandwidths.forEach(element => {
            const reportedBandwidth = element['bandwidth'];
            this.bandwidths.push({value: i, viewValue: reportedBandwidth / 1000});
            i++;
          });
          i = 0;
          const reportedIFs = deviceSettings.sdrPlayV3Report['intermediateFrequencies'];
          this.intermediateFrequencies = [];
          reportedIFs.forEach(element => {
            const reportedIF = element['frequency'];
            this.intermediateFrequencies.push({value: i, viewValue: reportedIF / 1000});
            i++;
          });
          this.deviceType = deviceSettings.sdrPlayV3Report['deviceType'];
          this.setTuners();
          this.setAntennas();
        } else {
          this.statusMessage = 'Not a SDRplay V3 device';
          this.statusError = true;
        }
      }
    );
  }

  private setLNA(freq: number, deviceType: string) {
    if (deviceType in SDRPLAYV3_ATT_FREQ_UP_BOUNDS) {
      let i = 0;
      for (const b of SDRPLAYV3_ATT_FREQ_UP_BOUNDS[deviceType]) {
        if (freq < b) {
          break;
        }
        i++;
      }
      if (i !== this.attBandIndex) {
        const atts = SDRPLAYV3_ATT[deviceType][i];
        let j = 0;
        this.lnaValues = [];
        for (const a of atts) {
          this.lnaValues.push({value: j, viewValue: -a});
          j++;
        }
        this.attBandIndex = i;
      }
    }
  }

  private setTuners() {
    if (this.deviceType in SDRPLAYV3_TUNERS) {
      let i = 0;
      for (const t of SDRPLAYV3_TUNERS[this.deviceType]) {
        this.tuners.push({value: i, viewValue: t});
        i++;
      }
    }
  }

  private setAntennas() {
    if (this.deviceType in SDRPLAYV3_ANTENNAS) {
      let i = 0;
      for (const a of SDRPLAYV3_ANTENNAS[this.deviceType]) {
        this.antennas.push({value: i, viewValue: a});
        i++;
      }
    }
  }

  isAMNotchDisabled() {
    return this.deviceType !== 'RSPduo';
  }

  isBiasTeeDisabled() {
    return this.deviceType === 'RSP1';
  }

  isExtRefDisabled() {
    return this.deviceType === 'RSP1' || this.deviceType === 'RSP1A' || this.deviceType === 'RSPdx';
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(sdrPlayV3Settings: SDRplayV3Settings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'SDRplayV3';
    settings.direction = 0,
    settings.sdrPlayV3Settings = sdrPlayV3Settings;
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

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    let min, max: number;
    min = this.getMinFrequency();
    max = this.getMaxFrequency();
    if (this.centerFreqKhz < min) {
      this.centerFreqKhz = min;
    } else if (this.centerFreqKhz > max) {
      this.centerFreqKhz = max;
    }
  }

  getMinFrequency() {
    return 1000;
  }

  getMaxFrequency() {
    return 2000 * 1000;
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setLoPPM() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setBandwidthIndex() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.bandwidthIndex = this.settings.bandwidthIndex;
    this.setDeviceSettings(newSettings);
  }

  setIntermediateFrequencyIndex() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.ifFrequencyIndex = this.settings.ifFrequencyIndex;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    this.validateSampleRate();
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  private validateSampleRate() {
    let min, max: number;
    min = 2000 * 1000;
    max = 10660 * 1000;
    if (this.settings.devSampleRate < min) {
      this.settings.devSampleRate = min;
    } else if (this.settings.devSampleRate > max) {
      this.settings.devSampleRate = max;
    }
  }

  getSampleRate(): number {
    return this.settings.devSampleRate / (1 << this.settings.log2Decim);
  }

  setLog2Decim() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setLNAIndex() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.lnaIndex = this.settings.lnaIndex;
    this.setDeviceSettings(newSettings);
  }

  setIFAGC() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.ifAGC = this.ifAGC ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIFGain() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.ifGain = this.ifGain;
    this.setDeviceSettings(newSettings);
  }

  setAMNotch() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.amNotch = this.amNotch ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setFMNotch() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.fmNotch = this.fmNotch ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setDABNotch() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.dabNotch = this.dabNotch ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBiasTee() {
    // TOOO
  }

  setExtRef() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.extRef = this.extRef ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTunerIndex() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.tuner = this.settings.tuner;
    this.setDeviceSettings(newSettings);
  }

  setAntennaIndex() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.antenna = this.settings.antenna;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: SDRplayV3Settings = <SDRplayV3Settings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
