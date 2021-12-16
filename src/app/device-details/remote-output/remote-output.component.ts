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
  useReverseAPI: boolean;
  deviceReportSubscription: Subscription;
  monitor: boolean;
  lastTimestampUs: number;
  deltaTimestampUs: number;
  lastSampleCount: number;
  deltaSampleCount: number;
  lastCorrectableCount: number;
  deltaCorrectableCount: number;
  lastUncorrectableCount: number;
  deltaUncorrectableCount: number;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
      this.lastSampleCount = 0;
      this.deltaSampleCount = 0;
      this.lastTimestampUs = 0;
      this.deltaTimestampUs = 0;
      this.lastCorrectableCount = 0;
      this.deltaCorrectableCount = 0;
      this.lastUncorrectableCount = 0;
      this.deltaUncorrectableCount = 0;
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
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a Remote output device';
          this.statusError = true;
        }
      }
    );
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            devicelReport => {
              if ((devicelReport.deviceHwType === 'RemoteOutput') && (devicelReport.direction === 1)) {
                this.report = devicelReport.remoteOutputReport;
                this.feedDeviceStore();
                const timestampUs = this.report.tvSec * 1000000 + this.report.tvUSec;
                if (this.lastTimestampUs === 0) {
                  this.lastTimestampUs = timestampUs;
                }
                this.deltaTimestampUs = timestampUs - this.lastTimestampUs;
                this.lastTimestampUs = timestampUs;
                if (this.report.sampleCount < this.lastSampleCount) {
                  this.deltaSampleCount = (0xFFFFFFFF - this.lastSampleCount) + this.report.sampleCount + 1;
                } else {
                  this.deltaSampleCount = this.report.sampleCount - this.lastSampleCount;
                }
                this.lastSampleCount = this.report.sampleCount;
                this.deltaCorrectableCount = this.report.correctableErrorsCount - this.lastCorrectableCount;
                this.deltaUncorrectableCount = this.report.uncorrectableErrorsCount - this.lastUncorrectableCount;
                this.lastCorrectableCount = this.report.correctableErrorsCount;
                this.lastUncorrectableCount = this.report.uncorrectableErrorsCount;
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

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.report.centerFrequency,
      basebandRate: this.report.sampleRate
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
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

  setNbFECBlocks() {
    const newSettings: RemoteOutputSettings = <RemoteOutputSettings>{};
    newSettings.nbFECBlocks = this.settings.nbFECBlocks;
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

  getReportDateTime(): string {
    const dateObj = new Date((this.report.tvSec * 1000000 + this.report.tvUSec) / 1000);
    return dateObj.toISOString();
  }

  getQueuePercentage(): number {
    return (this.report.queueLength * 100) / this.report.queueSize;
  }

  getStreamSampleRate(): number {
    if (this.deltaTimestampUs === 0) {
      return 0;
    } else {
      return (this.deltaSampleCount * 1e6) / this.deltaTimestampUs;
    }
  }

  getStreamStatusColor(): string {
    if (this.deltaSampleCount === 0) {
      return 'rgb(0, 0, 200, 1.0)';
    } else if (this.deltaUncorrectableCount !== 0) {
      return 'rgb(200, 0, 0, 1.0)';
    } else if (this.deltaCorrectableCount !== 0) {
      return 'rgb(160, 160, 160, 1.0)';
    } else {
      return 'rgb(0, 200, 0, 1.0)';
    }
  }

  getStreamStatusText(): string {
    if (this.deltaSampleCount === 0) {
      return 'Not streaming';
    } else if (this.deltaUncorrectableCount !== 0) {
      return 'Data lost';
    } else if (this.deltaCorrectableCount !== 0) {
      return 'Data corrected';
    } else {
      return 'Streaming OK';
    }
  }
}
