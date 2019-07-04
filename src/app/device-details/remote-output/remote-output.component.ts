import { Component, OnInit } from '@angular/core';
import { REMOTE_OUTPUT_SETTINGS_DEFAULT, RemoteOutputSettings, RemoteOutputReport, REMOTE_OUTPUT_REPORT_DEFAULT } from './remote-output';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from 'src/app/device-store.service';
import { DeviceSettings } from '../device-details';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';

@Component({
  selector: 'app-remote-output',
  templateUrl: './remote-output.component.html',
  styleUrls: ['./remote-output.component.css']
})
export class RemoteOutputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  report: RemoteOutputReport = REMOTE_OUTPUT_REPORT_DEFAULT;
  settings: RemoteOutputSettings = REMOTE_OUTPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  txDelayPercent: number;
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

  getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if ((deviceSettings.deviceHwType === 'RemoteOutput') && (deviceSettings.direction === 1)) {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.remoteOutputSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.txDelayPercent = Math.round(this.settings.txDelay * 100);
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a Remote output device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.settings.sampleRate
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            devicelReport => {
              if ((devicelReport.deviceHwType === 'RemoteOutput') && (devicelReport.direction === 1)) {
                this.report = devicelReport.remoteOutputReport;
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

  private setDeviceSettings(remoteOutputSettings: RemoteOutputSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'RemoteOutput';
    settings.direction = 1,
    settings.remoteOutputSettings = remoteOutputSettings;
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
    return this.settings.sampleRate;
  }

  setSampleRate() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.sampleRate = this.settings.sampleRate;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  setTxDelay() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.txDelay = this.txDelayPercent / 100;
    this.setDeviceSettings(newSettings);
  }

  setRemoteAPIAddress() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.apiAddress = this.settings.apiAddress;
    this.setDeviceSettings(newSettings);
  }

  setRemoteAPIPort() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.apiPort = this.settings.apiPort;
    this.setDeviceSettings(newSettings);
  }

  setLocalDataAddress() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.dataAddress = this.settings.dataAddress;
    this.setDeviceSettings(newSettings);
  }

  setLocalDataPort() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.dataPort = this.settings.dataPort;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }
}
