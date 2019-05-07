import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { FCDProPlusSettings, FCDPROPLUS_SETTINGS_DEFAULT } from '../fcdproplus/fcdproplus';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { Utils } from 'src/app/common-components/utils';

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface FcPos {
  value: number;
  viewValue: string;
}

export interface EnumStr {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-fcdproplus',
  templateUrl: './fcdproplus.component.html',
  styleUrls: ['./fcdproplus.component.css']
})
export class FcdproplusComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
  ];
  fcPositions: FcPos[] = [
    {value: 0, viewValue: 'Inf'},
    {value: 1, viewValue: 'Sup'},
    {value: 2, viewValue: 'Cen'},
  ];
  rfFilt: EnumStr[] = [
    {value: 0, viewValue: '0-4M'},
    {value: 1, viewValue: '4-8M'},
    {value: 2, viewValue: '8-16M'},
    {value: 3, viewValue: '16-32M'},
    {value: 4, viewValue: '32-75M'},
    {value: 5, viewValue: '75-125M'},
    {value: 6, viewValue: '125-250M'},
    {value: 7, viewValue: '145M'},
    {value: 8, viewValue: '410-875M'},
    {value: 9, viewValue: '435M'},
    {value: 10, viewValue: '875M-2G'},
  ];
  ifFilt: EnumStr[] = [
    {value: 0, viewValue: '200k'},
    {value: 1, viewValue: '300k'},
    {value: 2, viewValue: '600k'},
    {value: 3, viewValue: '1.5M'},
    {value: 4, viewValue: '5M'},
    {value: 5, viewValue: '6M'},
    {value: 6, viewValue: '7M'},
    {value: 7, viewValue: '8M'},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: FCDProPlusSettings = FCDPROPLUS_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  dcBlock: boolean;
  iqImbalance: boolean;
  transverter: boolean;
  useReverseAPI: boolean;
  lnaGain: boolean;
  mixGain: boolean;
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
      this.getDeviceSettings();
    });
  }

  getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'FCDPro+') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.fcdProPlusSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.transverter = this.settings.transverterMode !== 0;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqImbalance = this.settings.iqImbalance !== 0;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.lnaGain = this.settings.lnaGain !== 0;
          this.mixGain = this.settings.mixGain !== 0;
          this.biasT = this.settings.biasT !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a FCD Pro+ device';
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
    return 192000 / (1 << this.settings.log2Decim);
  }

  private setDeviceSettings(fcdProPlusSettings: FCDProPlusSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'FCDPro+';
    settings.direction = 0,
    settings.fcdProPlusSettings = fcdProPlusSettings;
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
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQImbalance() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.iqImbalance = this.iqImbalance ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 150) {
      this.centerFreqKhz = 150;
    } else if (this.centerFreqKhz > 20000000) {
      this.centerFreqKhz = 20000000;
    }
  }

  setTransverterMode() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setLNAGain() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.lnaGain = this.lnaGain ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setMixGain() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.mixGain = this.mixGain ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setBiasT() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.biasT = this.biasT ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setRFFilterIndex() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.rfFilterIndex = this.settings.rfFilterIndex;
    this.setDeviceSettings(newSettings);
  }

  setIFFilterIndex() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.ifFilterIndex = this.settings.ifFilterIndex;
    this.setDeviceSettings(newSettings);
  }

  setFileRecordName() {
    const newSettings: FCDProPlusSettings = <FCDProPlusSettings>{};
    newSettings.fileRecordName = this.settings.fileRecordName;
    this.setDeviceSettings(newSettings);
  }
}
