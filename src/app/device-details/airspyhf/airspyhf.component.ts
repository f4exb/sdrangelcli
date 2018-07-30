import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AirspyHFSettings, AIRSPYHF_SETTINGS_DEFAULT } from './airspyhf';
import { DeviceSettings } from '../device-details';

export interface SampleRate {
  value: number,
  viewValue: number
}

export interface Log2Decim {
  value: number,
  viewValue: number
}

export interface Band {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-airspyhf',
  templateUrl: './airspyhf.component.html',
  styleUrls: ['./airspyhf.component.css']
})
export class AirspyhfComponent implements OnInit {
  statusMessage: string;
  statusError: boolean = false;
  sampleRates: SampleRate[] = [
    {value: 0, viewValue: 768}
  ];
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  bands: Band[] = [
    {value: 0, viewValue: "HF"},
    {value: 1, viewValue: "VHF"},
  ];
  deviceIndex : number;
  sdrangelURL : string;
  settings: AirspyHFSettings = AIRSPYHF_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  transverter: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService)
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
        if (deviceSettings.deviceHwType == "AirspyHF") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.airspyHFSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.loPPM = this.settings.LOppmTenths/10;
          this.transverter = this.settings.transverterMode !== 0;
        } else {
          this.statusMessage = "Not an AirspyHF device";
          this.statusError = true;
        }
      }
    )
  }

  private setDeviceSettings(airspyhfSettings : AirspyHFSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "AirspyHF";
    settings.tx = 0,
    settings.airspyHFSettings = airspyhfSettings;
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
    return 768000/(1<<this.settings.log2Decim);
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setLoPPMTenths() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setSampleRateIndex() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.devSampleRateIndex = this.settings.devSampleRateIndex;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setBandIndex() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.bandIndex = this.settings.bandIndex;
    this.validateCenterFrequencyKhz();
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setFileRecordName() {
    const newSettings: AirspyHFSettings = <AirspyHFSettings>{};
    newSettings.fileRecordName = this.settings.fileRecordName;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    let min, max : number;
    if (this.settings.bandIndex === 0) {
      min = 9;
      max = 31000;
    } else {
      min = 60000;
      max = 260000;
    }
    if (this.centerFreqKhz < min) {
      this.centerFreqKhz = min;
    } else if (this.centerFreqKhz > max) {
      this.centerFreqKhz = max;
    }
  }
}
