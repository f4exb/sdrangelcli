import { Component, OnInit } from '@angular/core';
import { RemoteInputReport, REMOTE_INPUT_REPORT_DEFAULT, RemoteInputSettings, REMOTE_INPUT_SETTINGS_DEFAULT } from './remote-input';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from 'src/app/device-store.service';
import { DeviceSettings } from '../device-details';

@Component({
  selector: 'app-remote-input',
  templateUrl: './remote-input.component.html',
  styleUrls: ['./remote-input.component.css']
})
export class RemoteInputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  deviceIndex: number;
  sdrangelURL: string;
  report: RemoteInputReport = REMOTE_INPUT_REPORT_DEFAULT;
  settings: RemoteInputSettings = REMOTE_INPUT_SETTINGS_DEFAULT;
  dcBlock: boolean;
  iqCorrection: boolean;
  useReverseAPI: boolean;
  deviceReportSubscription: Subscription;
  monitor: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getDeviceSettings();
    });
  }

  private getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === 'RemoteInput') && (deviceSettings.tx === 0)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.remoteInputSettings;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.iqCorrection = this.settings.iqCorrection !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a Remote input device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.report.centerFrequency,
      basebandRate: this.report.sampleRate
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            devicelReport => {
              if ((devicelReport.deviceHwType === 'RemoteInput') && (devicelReport.tx === 0)) {
                this.report = devicelReport.remoteInputReport;
              }
            }
          );
        }
      );
    } else {
      this.deviceReportSubscription.unsubscribe();
      this.deviceReportSubscription = null;
    }
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  private setDeviceSettings(remoteInputSettings: RemoteInputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'RemoteInput';
    settings.tx = 0,
    settings.remoteInputSettings = remoteInputSettings;
    this.devicedetailsService.setSettings(this.sdrangelURL, this.deviceIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getDeviceSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  getSampleRate(): number {
    return this.report.sampleRate;
  }

  setDCBlock() {
    const newSettings: RemoteInputSettings = <RemoteInputSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setIQCorrection() {
    const newSettings: RemoteInputSettings = <RemoteInputSettings>{};
    newSettings.iqCorrection = this.iqCorrection ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: RemoteInputSettings = <RemoteInputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: RemoteInputSettings = <RemoteInputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: RemoteInputSettings = <RemoteInputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: RemoteInputSettings = <RemoteInputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
