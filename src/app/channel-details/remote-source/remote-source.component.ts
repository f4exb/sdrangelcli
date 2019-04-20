import { Component, OnInit } from '@angular/core';
import { RemoteSourceSettings, REMOTE_SOURCE_SETTINGS_DEFAULT, RemoteSourceReport, REMOTE_SOURCE_REPORT_DEFAULT } from './remote-source';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Subscription, interval } from 'rxjs';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

@Component({
  selector: 'app-remote-source',
  templateUrl: './remote-source.component.html',
  styleUrls: ['./remote-source.component.css']
})
export class RemoteSourceComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: RemoteSourceSettings = REMOTE_SOURCE_SETTINGS_DEFAULT;
  report: RemoteSourceReport = REMOTE_SOURCE_REPORT_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  lastTimestampUs: number;
  lastCorrectableCount: number;
  lastUncorrectableCount: number;
  lastSampleCount: number;
  deltaTimestampUs: number;
  deltaCorrectableCount: number;
  deltaUncorrectableCount: number;
  deltaSampleCount: number;
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
      this.deviceStoreSubscription = null;
      this.channelReportSubscription = null;
      this.monitor = false;
      this.lastTimestampUs = 0;
      this.lastCorrectableCount = 0;
      this.lastUncorrectableCount = 0;
      this.lastSampleCount = 0;
      this.deltaTimestampUs = 0;
      this.deltaCorrectableCount = 0;
      this.deltaUncorrectableCount = 0;
      this.deltaSampleCount = 0;
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.channelIndex = +this.route.snapshot.parent.params['cix'];
    this.getDeviceStorage();
    this.getChannelSettings();
  }

  private getDeviceStorage() {
    this.deviceStoreSubscription = this.deviceStoreService.get(this.deviceIndex).subscribe(
      deviceStorage => {
        this.deviceCenterFrequency = deviceStorage.centerFrequency;
        this.deviceBasebandRate = deviceStorage.basebandRate;
      },
      error => {
        if (error === 'No device at this index') {
          this.deviceSetService.getInfo(this.sdrangelURL, this.deviceIndex).subscribe(
            deviceset => {
              this.deviceStoreService.change(
                this.deviceIndex,
                {
                  basebandRate: deviceset.samplingDevice.bandwidth,
                  centerFrequency: deviceset.samplingDevice.centerFrequency
                }
              );
              this.deviceBasebandRate = deviceset.samplingDevice.bandwidth;
              this.deviceCenterFrequency = deviceset.samplingDevice.centerFrequency;
            }
          );
        }
      }
    );
  }

  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'RemoteSource') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.RemoteSourceSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a RemoteSource channel';
          this.statusError = true;
        }
      }
    );
  }

  private setDeviceSettings(daemonSourceSettings: RemoteSourceSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'RemoteSource';
    settings.tx = 1,
    settings.RemoteSourceSettings = daemonSourceSettings;
    this.channeldetailsService.setSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getChannelSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'DaemonSource') {
                this.report = channelReport.RemoteSourceReport;
                const timestampUs = this.report.tvSec * 1000000 + this.report.tvUSec;
                if (this.lastTimestampUs === 0) {
                  this.lastTimestampUs = timestampUs;
                }
                if (this.report.samplesCount < this.lastSampleCount) {
                  this.deltaSampleCount = (0xFFFFFFFF - this.lastSampleCount) + this.report.samplesCount + 1;
                } else {
                  this.deltaSampleCount = this.report.samplesCount - this.lastSampleCount;
                }
                this.deltaCorrectableCount = this.report.correctableErrorsCount - this.lastCorrectableCount;
                this.deltaUncorrectableCount = this.report.uncorrectableErrorsCount - this.lastUncorrectableCount;
                this.deltaTimestampUs = timestampUs - this.lastTimestampUs;
                this.lastTimestampUs = timestampUs;
                this.lastSampleCount = this.report.samplesCount;
                this.lastCorrectableCount = this.report.correctableErrorsCount;
                this.lastUncorrectableCount = this.report.uncorrectableErrorsCount;
              }
            }
          );
        }
      );
    } else {
      this.channelReportSubscription.unsubscribe();
      this.channelReportSubscription = null;
      this.lastTimestampUs = 0;
      this.lastCorrectableCount = 0;
      this.lastUncorrectableCount = 0;
      this.lastSampleCount = 0;
      this.deltaTimestampUs = 0;
      this.deltaCorrectableCount = 0;
      this.deltaUncorrectableCount = 0;
      this.deltaSampleCount = 0;
    }
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setDataAddress() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.dataAddress = this.settings.dataAddress;
    this.setDeviceSettings(newSettings);
  }

  setDataPort() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.dataPort = this.settings.dataPort;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: RemoteSourceSettings = <RemoteSourceSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
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
      return 'blue';
    } else if (this.deltaUncorrectableCount !== 0) {
      return 'red';
    } else if (this.deltaCorrectableCount !== 0) {
      return 'grey';
    } else {
      return 'green';
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
