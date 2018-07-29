import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AirspyHFSettings, AIRSPYHF_SETTINGS_DEFAULT } from './airspyhf';

export interface SampleRate {
  value: number;
  viewValue: number;
}

export interface Log2Decim {
  value: number;
  viewValue: number
}

export interface Band {
  value: number;
  viewValue: string
}

@Component({
  selector: 'app-airspyhf',
  templateUrl: './airspyhf.component.html',
  styleUrls: ['./airspyhf.component.css']
})
export class AirspyhfComponent implements OnInit {
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
  settingsMod: AirspyHFSettings;
  centerFreqKhz: number;
  loPPM: number;
  transverter: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService)
  {
  }

  ngOnInit() {
    this.settingsMod = <AirspyHFSettings>{};
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
          this.settings = deviceSettings.airspyHFSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.loPPM = this.settings.LOppmTenths/10;
          this.transverter = this.settings.transverterMode !== 0;
        }
      }
    )
  }

  setCenterFrequency() {
    this.settingsMod.centerFrequency = this.centerFreqKhz * 1000;
    console.log(this.settingsMod);
  }

  setLoPPMTenths() {
    this.settingsMod.LOppmTenths = this.loPPM * 10;
    console.log(this.settingsMod);
  }

  setSampleRateIndex() {
    this.settingsMod.devSampleRateIndex = this.settings.devSampleRateIndex;
  }

  setLog2Decim() {
    this.settingsMod.log2Decim = this.settings.log2Decim;
    console.log(this.settingsMod);
  }

  setTransverterMode() {
    this.settingsMod.transverterMode = this.transverter ? 1 : 0;
  }

  setTransverterFrequency() {
    this.settingsMod.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
  }

  setBandIndex() {
    this.settingsMod.bandIndex = this.settings.bandIndex;
  }

  setFileRecordName() {
    this.settingsMod.fileRecordName = this.settings.fileRecordName;
  }
}
