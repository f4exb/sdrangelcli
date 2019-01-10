import { Component, OnInit } from '@angular/core';
import { InstanceSummary, INSTANCE_SUMMARY_DEFAULT } from './instance-summary';
import { InstanceSummaryService } from './instance-summary.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { DevicesetComponent } from '../../deviceset/deviceset/deviceset.component';

@Component({
  selector: 'app-instance-summary',
  templateUrl: './instance-summary.component.html',
  styleUrls: ['./instance-summary.component.css']
})
export class InstanceSummaryComponent implements OnInit {

  sdrangelURL: string;
  instanceSummary: InstanceSummary = INSTANCE_SUMMARY_DEFAULT;
  statusMessage: string;
  statusError = false;

  constructor(private instanceSummaryService: InstanceSummaryService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchInstanceSummary();
    });
  }

  private fetchInstanceSummary() {
    this.instanceSummaryService.getInfo(this.sdrangelURL).subscribe(
      instanceSummary => {
        this.instanceSummary = instanceSummary;
        this.feedDeviceStore();
        this.statusMessage = 'OK';
        this.statusError = false;
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  private feedDeviceStore() {
    if (this.instanceSummary.devicesetlist.devicesetcount > 0) {
      this.instanceSummary.devicesetlist.deviceSets.forEach((deviceSet, deviceIndex) => {
        this.deviceStoreService.change(deviceIndex, {
          centerFrequency: deviceSet.samplingDevice.centerFrequency,
          basebandRate: deviceSet.samplingDevice.bandwidth});
      });
    }
  }

}
