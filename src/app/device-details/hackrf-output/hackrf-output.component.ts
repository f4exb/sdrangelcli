import { Component, OnInit } from '@angular/core';
import { HackRFOutputSettings, HACKRF_OUTPUT_SETTINGS_DEFAULT } from './hackrf-output';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';
import { DeviceSettings } from '../device-details';

interface Log2Interp {
  value: number,
  viewValue: number
}

interface RFBandwidth {
  value: number,
  viewValue: number
}

@Component({
  selector: 'app-hackrf-output',
  templateUrl: './hackrf-output.component.html',
  styleUrls: ['./hackrf-output.component.css']
})
export class HackrfOutputComponent implements OnInit {
  statusMessage: string;
  statusError: boolean = false;
  log2Interps: Log2Interp[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
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
  ]
  deviceIndex : number;
  sdrangelURL : string;
  settings: HackRFOutputSettings = HACKRF_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  loPPM: number;
  biasT: boolean;
  rfAmp: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService)
  { }

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
        if ((deviceSettings.deviceHwType == "HackRF") && (deviceSettings.tx !== 0)) {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = deviceSettings.hackRFOutputSettings;
          this.centerFreqKhz = this.settings.centerFrequency/1000;
          this.loPPM = this.settings.LOppmTenths / 10;
          this.biasT = this.settings.biasT !== 0;
          this.rfAmp = this.settings.lnaExt !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = "Not a HackRF output device";
          this.statusError = true;
        }
      }
    )
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.devSampleRate/(1<<this.settings.log2Interp)
    }
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  private setDeviceSettings(hackrfSettings : HackRFOutputSettings) {
    const settings : DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = "HackRF";
    settings.tx = 1,
    settings.hackRFOutputSettings = hackrfSettings;
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
    return this.settings.devSampleRate/(1<<this.settings.log2Interp);
  }

  setLoPPM() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.LOppmTenths = this.loPPM * 10;
    this.setDeviceSettings(newSettings);
  }

  setCenterFrequency() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setRFBandwidth() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.bandwidth = this.settings.bandwidth;
    this.setDeviceSettings(newSettings);
  }

  setBiasT() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.biasT = this.biasT ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.devSampleRate = this.settings.devSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setLog2Interp() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.log2Interp = this.settings.log2Interp;
    this.setDeviceSettings(newSettings);
  }

  setRFAmp() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.lnaExt = this.rfAmp ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setVGAGain() {
    const newSettings: HackRFOutputSettings = <HackRFOutputSettings>{};
    newSettings.vgaGain = this.settings.vgaGain;
    this.setDeviceSettings(newSettings);
  }

}
