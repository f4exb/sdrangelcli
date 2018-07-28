import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SdrangelUrlService } from '../sdrangel-url.service';
import { DeviceDetailsService } from './device-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
  deviceIndex: number;
  private sub: Subscription;
  sdrangelURL : string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,)
  {
    this.sub = null;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.deviceIndex = +params['dix']; // (+) converts string 'dix' to a number
    });
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getDeviceSettings();
    });
  }

  ngOnDestroy() {
    (this.sub) && this.sub.unsubscribe();
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType == "AirspyHF") {
          this.router.navigate(['airspyhf'], { relativeTo: this.route});
        } else {
          this.router.navigate(['notsupported'], { relativeTo: this.route});
        }
      }
    )
  }
}
