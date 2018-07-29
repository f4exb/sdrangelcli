import { Component, OnInit } from '@angular/core';
import { RTLSDRSettings, RTLSDR_SETTINGS_DEFAULT } from './rtlsdr';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';


export interface Log2Decim {
  value: number,
  viewValue: number
}

export interface FcPos {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-rtlsdr',
  templateUrl: './rtlsdr.component.html',
  styleUrls: ['./rtlsdr.component.css']
})
export class RtlsdrComponent implements OnInit {
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
    {value: 0, viewValue: "Cen"},
  ];
  deviceIndex : number;
  sdrangelURL : string;
  settings: RTLSDRSettings = RTLSDR_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  transverter: boolean;
  agc: boolean;
  lowSampleRate: boolean;
  noModMode: boolean;

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
        if (deviceSettings.deviceHwType == "RTLSDR") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.rtlSdrSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.transverter = this.settings.transverterMode !== 0;
        } else {
          this.statusMessage = "Not a RTLSDR device";
          this.statusError = true;
        }
      }
    )
  }

  private setDeviceSettings(rtlsdrSettings : RTLSDRSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "RTLSDR";
    settings.tx = 0,
    settings.rtlSdrSettings = rtlsdrSettings;
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
    return this.settings.devSampleRate/(1<<this.settings.log2Decim);
  }

  setLoPPM() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.loPpmCorrection = this.settings.loPpmCorrection;
    this.setDeviceSettings(newSettings);
  }

  setDCBlock() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.iqImbalance = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAGC() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.agc = this.agc ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setCenterFrequency() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFcPos() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.fcPos = this.settings.fcPos;
    this.setDeviceSettings(newSettings);
  }

  setTransverterMode() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.transverterMode = this.transverter ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setTransverterFrequency() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.transverterDeltaFrequency = this.settings.transverterDeltaFrequency;
    this.setDeviceSettings(newSettings);
  }

  setLowSampleRate() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.lowSampleRate = this.lowSampleRate ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setModMode() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.noModMode = this.noModMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

}
