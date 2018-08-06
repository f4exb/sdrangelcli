import { Component, OnInit } from '@angular/core';
import { TestSourceSettings, TESTSOURCE_SETTINGS_DEFAULT } from './testsource';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';

interface Log2Decim {
  value: number,
  viewValue: number
}

interface FcPos {
  value: number,
  viewValue: string
}

interface AutoCorrOptions {
  value: number,
  viewValue: string
}

interface SampleSize {
  value: number,
  viewValue: number
}

interface Modulation {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-testsource',
  templateUrl: './testsource.component.html',
  styleUrls: ['./testsource.component.css']
})
export class TestsourceComponent implements OnInit {
  statusMessage: string;
  statusError: boolean = false;
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
    {value: 0, viewValue: "Inf"},
    {value: 1, viewValue: "Sup"},
    {value: 2, viewValue: "Cen"},
  ];
  autoCorrOptionsList: AutoCorrOptions[] = [
    {value: 0, viewValue: "None"},
    {value: 1, viewValue: "DC"},
    {value: 2, viewValue: "DC+IQ"},
  ]
  sampleSizes: SampleSize[] = [
    {value: 0, viewValue: 8},
    {value: 1, viewValue: 12},
    {value: 2, viewValue: 16},
  ];
  modulations: Modulation[] = [
    {value: 0, viewValue: "None"},
    {value: 1, viewValue: "AM"},
    {value: 2, viewValue: "FM"},
  ]
  deviceIndex : number;
  sdrangelURL : string;  
  settings: TestSourceSettings = TESTSOURCE_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  toneFreqKhz: number;
  fmDeviationKhz: number;
  dcBiasPercent : number;
  iBiasPercent : number;
  qBiasPercent : number;
  phaseImbalancePercent : number;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) 
  { 
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix']
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getDeviceSettings();
    });    
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType == "TestSource") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.testSourceSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.toneFreqKhz = this.settings.modulationTone/100;
          this.fmDeviationKhz = this.settings.fmDeviation/10;
          this.dcBiasPercent = +(this.settings.dcFactor*100).toFixed(0);
          this.iBiasPercent = +(this.settings.iFactor*100).toFixed(0);
          this.qBiasPercent = +(this.settings.qFactor*100).toFixed(0);
          this.phaseImbalancePercent = +(this.settings.phaseImbalance*100).toFixed(0);
          this.feedDeviceStore();
        } else {
          this.statusMessage = "Not a TestSource device";
          this.statusError = true;
        }
      }
    )
  }
  
  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.sampleRate/(1<<this.settings.log2Decim)
    }
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }  

  private setDeviceSettings(testSourceSettings : TestSourceSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "TestSource";
    settings.tx = 0,
    settings.testSourceSettings = testSourceSettings;
    this.devicedetailsService.setSettings(this.sdrangelURL, this.deviceIndex, settings).subscribe(
      res => {
        console.log("Set settings OK", res);
        this.statusMessage = "OK";
        this.statusError = false;
        this.getDeviceSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    )
  }

  getSampleRate() : number {
    return this.settings.sampleRate/(1<<this.settings.log2Decim);
  }

  getMaxAmplitudeBits(): number {
    if (this.settings.sampleSizeIndex == 0) { // 8 bits
      return (1<<8) - 1;
    } else if (this.settings.sampleSizeIndex == 1) { // 12 bits
      return (1<<12) - 1;
    } else { // 16 bits
      return (1<<16) - 1;
    }
  }

  setAutoCorrOptions() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.autoCorrOptions = this.settings.autoCorrOptions;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setSampleSize() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.sampleSizeIndex = this.settings.sampleSizeIndex;
    this.setDeviceSettings(newSettings);
  }

  setCenterFrequency() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.sampleRate = this.settings.sampleRate;
    this.setDeviceSettings(newSettings);
  }

  setFrequencyShift() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.frequencyShift = this.settings.frequencyShift;
    this.setDeviceSettings(newSettings);
  }

  setModulation() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.modulation = this.settings.modulation;
    this.setDeviceSettings(newSettings);
  }
  
  setToneFrequency() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.modulationTone = this.toneFreqKhz * 100;
    this.setDeviceSettings(newSettings);
  }

  setAMModulation() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.amModulation = this.settings.amModulation;
    this.setDeviceSettings(newSettings);
  }

  setFMDeviation() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.fmDeviation = this.fmDeviationKhz * 10;
    this.setDeviceSettings(newSettings);
  }

  setAmplitudeBits() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.amplitudeBits = this.settings.amplitudeBits;
    this.setDeviceSettings(newSettings);
  }

  setDCBias() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.dcFactor = this.dcBiasPercent / 100;
    this.setDeviceSettings(newSettings);
  }

  setIBias() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.iFactor = this.iBiasPercent / 100;
    this.setDeviceSettings(newSettings);
  }

  setQBias() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.qFactor = this.qBiasPercent / 100;
    this.setDeviceSettings(newSettings);
  }

  setPhaseImbalance() {
    const newSettings: TestSourceSettings = <TestSourceSettings>{};
    newSettings.phaseImbalance = this.phaseImbalancePercent / 100;
    this.setDeviceSettings(newSettings);
  }
}
