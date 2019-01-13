import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { FCDProSettings, FCDPRO_SETTINGS_DEFAULT } from './fcdpro';
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
  selector: 'app-fcdpro-input',
  templateUrl: './fcdpro-input.component.html',
  styleUrls: ['./fcdpro-input.component.css']
})
export class FcdproInputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
  ];
  fcPositions: FcPos[] = [
    {value: 0, viewValue: 'Inf'},
    {value: 1, viewValue: 'Sup'},
    {value: 2, viewValue: 'Cen'},
  ];
  lnaEnh: EnumStr[] = [
    {value: 0, viewValue: 'Off'},
    {value: 1, viewValue: '0'},
    {value: 2, viewValue: '1'},
    {value: 3, viewValue: '2'},
    {value: 4, viewValue: '3'},
  ];
  band: EnumStr[] = [
    {value: 0, viewValue: 'VHF2'},
    {value: 1, viewValue: 'VHF3'},
    {value: 2, viewValue: 'UHF'},
    {value: 3, viewValue: 'L'},
  ];
  bias: EnumStr[] = [
    {value: 0, viewValue: 'L'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: 'VU'},
  ];
  mode: EnumStr[] = [
    {value: 0, viewValue: 'Lin'},
    {value: 1, viewValue: 'Sens'},
  ];
  lnaGain: EnumStr[] = [
    {value: 0, viewValue: '-5'},
    {value: 1, viewValue: '-2.5'},
    {value: 2, viewValue: '0'},
    {value: 3, viewValue: '2.5'},
    {value: 4, viewValue: '5'},
    {value: 5, viewValue: '7.5'},
    {value: 6, viewValue: '10'},
    {value: 7, viewValue: '12.5'},
    {value: 8, viewValue: '15'},
    {value: 9, viewValue: '17.5'},
    {value: 10, viewValue: '20'},
    {value: 11, viewValue: '25'},
    {value: 12, viewValue: '30'},
  ];
  rfFilt: EnumStr[] = [
    // Band 0, VHF II
    {value: 0, viewValue: 'LP268M'},
    {value: 1, viewValue: 'LP299M'},
    // Band 1, VHF III
    {value: 2, viewValue: 'LP509M'},
    {value: 3, viewValue: 'LP656M'},
    // Band 2, UHF
    {value: 4, viewValue: 'BP360M'},
    {value: 5, viewValue: 'BP390M'},
    {value: 6, viewValue: 'BP405M'},
    {value: 7, viewValue: 'BP425M'},
    {value: 8, viewValue: 'BP450M'},
    {value: 9, viewValue: 'BP475M'},
    {value: 10, viewValue: 'BP505M'},
    {value: 11, viewValue: 'BP540M'},
    {value: 12, viewValue: 'BP575M'},
    {value: 13, viewValue: 'BP615M'},
    {value: 14, viewValue: 'BP670M'},
    {value: 15, viewValue: 'BP720M'},
    {value: 16, viewValue: 'BP760M'},
    {value: 17, viewValue: 'BP840M'},
    {value: 18, viewValue: 'BP890M'},
    {value: 19, viewValue: 'BP970M'},
    // Band 2, L band
    {value: 20, viewValue: 'BP1.3G'},
    {value: 21, viewValue: 'BP1.32G'},
    {value: 22, viewValue: 'BP1.36G'},
    {value: 23, viewValue: 'BP1.41G'},
    {value: 24, viewValue: 'BP1445M'},
    {value: 25, viewValue: 'BP1.46G'},
    {value: 26, viewValue: 'BP1.49G'},
    {value: 27, viewValue: 'BP1.53G'},
    {value: 28, viewValue: 'BP1.56G'},
    {value: 29, viewValue: 'BP1.59G'},
    {value: 30, viewValue: 'BP1.64G'},
    {value: 31, viewValue: 'BP1.66G'},
    {value: 32, viewValue: 'BP1.68G'},
    {value: 33, viewValue: 'BP1.7G'},
    {value: 34, viewValue: 'BP1.72G'},
    {value: 35, viewValue: 'BP1.75G'},
  ];
  mixGain: EnumStr[] = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '12'},
  ];
  mixFilt: EnumStr[] = [
    {value: 0, viewValue: '27M'},
    {value: 1, viewValue: '4.6M'},
    {value: 2, viewValue: '4.2M'},
    {value: 3, viewValue: '3.8M'},
    {value: 4, viewValue: '3.4M'},
    {value: 5, viewValue: '3.0M'},
    {value: 6, viewValue: '2.7M'},
    {value: 7, viewValue: '2.3M'},
    {value: 8, viewValue: '1.9M'},
  ];
  gain1: EnumStr[] = [
    {value: 0, viewValue: '3'},
    {value: 1, viewValue: '6'},
  ];
  rcFilt: EnumStr[] = [
    {value: 0, viewValue: '21.4M'},
    {value: 1, viewValue: '21.0M'},
    {value: 2, viewValue: '17.6M'},
    {value: 3, viewValue: '14.7M'},
    {value: 4, viewValue: '12.4M'},
    {value: 5, viewValue: '18.6M'},
    {value: 6, viewValue: '9.0M'},
    {value: 7, viewValue: '7.7M'},
    {value: 8, viewValue: '6.4M'},
    {value: 9, viewValue: '5.3M'},
    {value: 10, viewValue: '4.4M'},
    {value: 11, viewValue: '3.4M'},
    {value: 12, viewValue: '2.6M'},
    {value: 13, viewValue: '1.8M'},
    {value: 14, viewValue: '1.2M'},
    {value: 15, viewValue: '1.0M'},
  ];
  gain2: EnumStr[] = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '3'},
    {value: 2, viewValue: '6'},
    {value: 3, viewValue: '9'},
  ];
  gain3: EnumStr[] = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '3'},
    {value: 2, viewValue: '6'},
    {value: 3, viewValue: '9'},
  ];
  gain4: EnumStr[] = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
  ];
  ifFilt: EnumStr[] = [
    {value: 0, viewValue: '5.5M'},
    {value: 1, viewValue: '5.3M'},
    {value: 2, viewValue: '5.0M'},
    {value: 3, viewValue: '4.8M'},
    {value: 4, viewValue: '4.6M'},
    {value: 5, viewValue: '4.4M'},
    {value: 6, viewValue: '4.3M'},
    {value: 7, viewValue: '4.1M'},
    {value: 8, viewValue: '3.9M'},
    {value: 9, viewValue: '3.8M'},
    {value: 10, viewValue: '3.7M'},
    {value: 11, viewValue: '3.6M'},
    {value: 12, viewValue: '3.4M'},
    {value: 13, viewValue: '3.3M'},
    {value: 14, viewValue: '3.2M'},
    {value: 15, viewValue: '3.1M'},
    {value: 16, viewValue: '3.0M'},
    {value: 17, viewValue: '2.95M'},
    {value: 18, viewValue: '2.9M'},
    {value: 19, viewValue: '2.8M'},
    {value: 20, viewValue: '2.75M'},
    {value: 21, viewValue: '2.7M'},
    {value: 22, viewValue: '2.6M'},
    {value: 23, viewValue: '2.55M'},
    {value: 24, viewValue: '2.5M'},
    {value: 25, viewValue: '2.45M'},
    {value: 26, viewValue: '2.4M'},
    {value: 27, viewValue: '2.3M'},
    {value: 28, viewValue: '2.28M'},
    {value: 29, viewValue: '2.24M'},
    {value: 30, viewValue: '2.2M'},
    {value: 31, viewValue: '2.15M'},
  ];
  gain5: EnumStr[] = [
    {value: 0, viewValue: '3'},
    {value: 1, viewValue: '6'},
    {value: 2, viewValue: '9'},
    {value: 3, viewValue: '12'},
    {value: 4, viewValue: '15'},
  ];
  gain6: EnumStr[] = [
    {value: 0, viewValue: '3'},
    {value: 1, viewValue: '6'},
    {value: 2, viewValue: '9'},
    {value: 3, viewValue: '12'},
    {value: 4, viewValue: '15'},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: FCDProSettings = FCDPRO_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  transverter: boolean;
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
        if (deviceSettings.deviceHwType === 'FCDPro') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.fcdProSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.transverter = this.settings.transverterMode !== 0;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a FCD Pro device';
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
    return 96000 / (1 << this.settings.log2Decim);
  }

  private setDeviceSettings(fcdProSettings: FCDProSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'FCDPro';
    settings.tx = 0,
    settings.fcdProSettings = fcdProSettings;
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
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 24000) {
      this.centerFreqKhz = 24000;
    } else if (this.centerFreqKhz > 19000000) {
      this.centerFreqKhz = 19000000;
    }
  }

  setTransverterMode() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setLNAGainIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.lnaGainIndex = this.settings.lnaGainIndex;
    this.setDeviceSettings(newSettings);
  }

  setRFFilterIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.rfFilterIndex = this.settings.rfFilterIndex;
    this.setDeviceSettings(newSettings);
  }

  setLNAEnhanceIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.lnaEnhanceIndex = this.settings.lnaEnhanceIndex;
    this.setDeviceSettings(newSettings);
  }

  setBandIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.bandIndex = this.settings.bandIndex;
    this.setDeviceSettings(newSettings);
  }

  setMixerGainIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.mixerGainIndex = this.settings.mixerGainIndex;
    this.setDeviceSettings(newSettings);
  }

  setBiasCurrentIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.biasCurrentIndex = this.settings.biasCurrentIndex;
    this.setDeviceSettings(newSettings);
  }

  setModeIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.modeIndex = this.settings.modeIndex;
    this.setDeviceSettings(newSettings);
  }

  setMixerFilterIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.mixerFilterIndex = this.settings.mixerFilterIndex;
    this.setDeviceSettings(newSettings);
  }

  setGain1Index() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.gain1Index = this.settings.gain1Index;
    this.setDeviceSettings(newSettings);
  }

  setRCFilterIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.rcFilterIndex = this.settings.rcFilterIndex;
    this.setDeviceSettings(newSettings);
  }

  setGain2Index() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.gain2Index = this.settings.gain2Index;
    this.setDeviceSettings(newSettings);
  }

  setGain3Index() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.gain3Index = this.settings.gain3Index;
    this.setDeviceSettings(newSettings);
  }

  setGain4Index() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.gain4Index = this.settings.gain4Index;
    this.setDeviceSettings(newSettings);
  }

  setIFFilterIndex() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.ifFilterIndex = this.settings.ifFilterIndex;
    this.setDeviceSettings(newSettings);
  }

  setGain5Index() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.gain5Index = this.settings.gain5Index;
    this.setDeviceSettings(newSettings);
  }

  setGain6Index() {
    const newSettings: FCDProSettings = <FCDProSettings>{};
    newSettings.gain6Index = this.settings.gain6Index;
    this.setDeviceSettings(newSettings);
  }
}
