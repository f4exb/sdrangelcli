import { Component, OnInit } from '@angular/core';
import { KiwiSDRSettings, KIWISDR_SETTINGS_DEFAULT, KiwiSDRReport, KIWISDR_REPORT_DEFAULT } from './kiwisdr';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceStoreService, DeviceStorage } from 'src/app/device-store.service';
import { DeviceSettings } from '../device-details';
import { Utils } from 'src/app/common-components/utils';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-kiwisdr',
  templateUrl: './kiwisdr.component.html',
  styleUrls: ['./kiwisdr.component.css']
})
export class KiwisdrComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  report: KiwiSDRReport = KIWISDR_REPORT_DEFAULT;
  settings: KiwiSDRSettings = KIWISDR_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  dcBlock: boolean;
  useAGC: boolean;
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
      this.getDeviceReport();
      this.getDeviceSettings();
    });
  }

  getDeviceSettings() {
    this.devicedetailsService.getSettings(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceSettings => {
        if (deviceSettings.deviceHwType === 'KiwiSDR') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = deviceSettings.kiwiSDRSettings;
          this.centerFreqKhz = this.settings.centerFrequency / 1000;
          this.dcBlock = this.settings.dcBlock !== 0;
          this.useAGC = this.settings.useAGC !== 0;
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.feedDeviceStore();
        } else {
          this.statusMessage = 'Not a KiwiSDR device';
          this.statusError = true;
        }
      }
    );
  }

  private getDeviceReport() {
    this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
      deviceReport => {
        if (deviceReport.deviceHwType === 'KiwiSDR') {
          this.statusMessage = 'OK';
          this.statusError = false;
        } else {
          this.statusMessage = 'Not a KiwiSDR device';
          this.statusError = true;
        }
      }
    );
  }

  private feedDeviceStore() {
    const deviceStorage = <DeviceStorage>{
      centerFrequency: this.settings.centerFrequency,
      basebandRate: this.getSampleRate()
    };
    this.deviceStoreService.change(this.deviceIndex, deviceStorage);
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.deviceReportSubscription = interval(1000).subscribe(
        _ => {
          this.devicedetailsService.getReport(this.sdrangelURL, this.deviceIndex).subscribe(
            devicelReport => {
              if ((devicelReport.deviceHwType === 'KiwiSDR') && (devicelReport.direction === 0)) {
                this.report = devicelReport.kiwiSDRReport;
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

  getConnexionStatusColor(): string {
    switch (this.report.status) {
      case 0: {
        return 'grey';
      }
      case 1: {
        return 'orange';
      }
      case 2: {
        return 'rgb(50,180,50)';
      }
      case 3: {
        return 'rgb(180,50,50)';
      }
      case 4: {
        return 'rgb(180,50,180)';
      }
      default: {
        return 'white';
      }
    }
  }

  getConnexionStatusText(): string {
    switch (this.report.status) {
      case 0: {
        return 'Idle';
      }
      case 1: {
        return 'Connecting';
      }
      case 2: {
        return 'Connected';
      }
      case 3: {
        return 'Error';
      }
      case 4: {
        return 'Disconnected';
      }
      default: {
        return 'Unknown';
      }
    }
  }

  getSampleRate(): number {
    return 12000;
  }

  private setDeviceSettings(kiwiSDRSettings: KiwiSDRSettings) {
    const settings: DeviceSettings = <DeviceSettings>{};
    settings.deviceHwType = 'KiwiSDR';
    settings.direction = 0,
    settings.kiwiSDRSettings = kiwiSDRSettings;
    this.devicedetailsService.setSettings(this.sdrangelURL, this.deviceIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        Utils.delayObservable(1000).subscribe(
          _ => { this.getDeviceSettings(); }
        );
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  setDCBlock() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.dcBlock = this.dcBlock ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setUseAGC() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.useAGC = this.useAGC ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  onFrequencyUpdate(frequency: number) {
    this.centerFreqKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    this.validateCenterFrequencyKhz();
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.centerFrequency = this.centerFreqKhz * 1000;
    this.setDeviceSettings(newSettings);
  }

  private validateCenterFrequencyKhz() {
    if (this.centerFreqKhz < 9) {
      this.centerFreqKhz = 9;
    } else if (this.centerFreqKhz > 32000) {
      this.centerFreqKhz = 32000;
    }
  }

  setGain() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.gain = this.settings.gain;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setServerAddress() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.serverAddress = this.settings.serverAddress;
    this.setDeviceSettings(newSettings);
  }

  setFileRecordName() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.fileRecordName = this.settings.fileRecordName;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: KiwiSDRSettings = <KiwiSDRSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

}
