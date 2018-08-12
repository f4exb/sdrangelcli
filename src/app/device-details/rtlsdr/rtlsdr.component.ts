import { Component, OnInit } from '@angular/core';
import { RTLSDRSettings, RTLSDR_SETTINGS_DEFAULT } from './rtlsdr';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';


export interface Log2Decim {
  value: number,
  viewValue: number
}

export interface FcPos {
  value: number,
  viewValue: string
}

export interface Gain {
  value: number,
  viewValue: number
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
    {value: 2, viewValue: "Cen"},
  ];
  gains: Gain[] = [
  ];
  deviceIndex : number;
  sdrangelURL : string;
  settings: RTLSDRSettings = RTLSDR_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  rfBandwidthKhz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  transverter: boolean;
  agc: boolean;
  lowSampleRate: boolean;
  noModMode: boolean;

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
      this.getDeviceReport();
    });
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === "RTLSDR") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.rtlSdrSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth/1000;
          this.transverter = this.settings.transverterMode !== 0;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqImbalance !== 0;
          this.agc = this.settings.agc !== 0;
          this.lowSampleRate = this.settings.lowSampleRate !== 0;
          this.noModMode = this.settings.noModMode !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = "Not a RTLSDR device";
          this.statusError = true;
        }
      }
    )
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === "RTLSDR") {
          this.statusMessage = "OK";
          this.statusError = false;
          let reportedGains = deviceSettings.rtlSdrReport["gains"];
          this.gains = [];
          reportedGains.forEach(element => {
            let reportedGain = element["gainCB"];
            this.gains.push({value: reportedGain, viewValue: reportedGain/10});
          });
        } else {
          this.statusMessage = "Not a RTLSDR device";
          this.statusError = true;
        }
      }
    )
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate/(1<<this.settings.log2Decim)
    }
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
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
    this.validateCenterFrequencyKhz();
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setGain() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    this.validateRFBandwidth();
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz * 1000;
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
    this.validateSampleRate();
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    this.validateSampleRate();
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setModMode() {
    const newSettings: RTLSDRSettings = <RTLSDRSettings>{};
    newSettings.noModMode = this.noModMode ? 1 : 0;
    this.validateCenterFrequencyKhz();
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateSampleRate() {
    let min, max : number;
    min = this.lowSampleRate ? 230000 : 950000;
    max = this.lowSampleRate ? 300000 : 2400000;
    if (this.settings.devSampleRate < min) {
      this.settings.devSampleRate = min;
    } else if (this.settings.devSampleRate > max) {
      this.settings.devSampleRate = max;
    }
  }

  private validateRFBandwidth() {
    if (this.rfBandwidthKhz < 350) {
      this.rfBandwidthKhz = 350;
    } else if (this.rfBandwidthKhz > 8000) {
      this.rfBandwidthKhz = 8000;
    }
  }

  private validateCenterFrequencyKhz() {
    let min, max : number;
    min = this.noModMode ? 0 : 24000;
    max = this.lowSampleRate ? 275000 : 1900000;
    if (this.centerFreqKhz < min) {
      this.centerFreqKhz = min;
    } else if (this.centerFreqKhz > max) {
      this.centerFreqKhz = max;
    }
  }
}
