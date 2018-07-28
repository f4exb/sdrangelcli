import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AirspyHFSettings, AIRSPYHF_SETTINGS_DEFAULT } from './airspyhf';

@Component({
  selector: 'app-airspyhf',
  templateUrl: './airspyhf.component.html',
  styleUrls: ['./airspyhf.component.css']
})
export class AirspyhfComponent implements OnInit {
  deviceIndex : number;
  sdrangelURL : string;
  settings: AirspyHFSettings = AIRSPYHF_SETTINGS_DEFAULT;

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
          this.settings = deviceSettings.airspyHFSettings;
        }
      }
    )
  }

}
