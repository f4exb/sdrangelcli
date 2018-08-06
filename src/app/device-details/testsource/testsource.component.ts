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
  deviceIndex : number;
  sdrangelURL : string;  
  settings: TestSourceSettings = TESTSOURCE_SETTINGS_DEFAULT;
  centerFreqKhz: number;

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
}
