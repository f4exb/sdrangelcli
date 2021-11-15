import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelActions, ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { FileSourceActions, FileSourceReport, FileSourceSettings, FILESOURCE_ACTIONS_DEFAULT, FILESOURCE_REPORT_DEFAULT, FILESOURCE_SETTINGS_DEFAULT } from './file-source';

export interface Log2Interp {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-file-source',
  templateUrl: './file-source.component.html',
  styleUrls: ['./file-source.component.css']
})
export class FileSourceComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: FileSourceSettings = FILESOURCE_SETTINGS_DEFAULT;
  report: FileSourceReport = FILESOURCE_REPORT_DEFAULT;
  actions: FileSourceActions = FILESOURCE_ACTIONS_DEFAULT;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  useReverseAPI: boolean;
  log2Interps: Log2Interp[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  loop = false;
  fixedShiftIndex = 0;
  maxFixedShiftIndex = 0;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
      this.deviceStoreSubscription = null;
      this.channelReportSubscription = null;
      this.monitor = false;
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit(): void {
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

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'FileSource') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.FileSourceSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.fixedShiftIndex = this.settings.filterChainHash;
          this.maxFixedShiftIndex = this.getNbFixedShiftIndexes(this.settings.log2Interp);
        } else {
          this.statusMessage = 'Not a FileSink channel';
          this.statusError = true;
        }
      }
    );
  }

  private setChannelSettings(fileSourceSettings: FileSourceSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'FileSource';
    settings.direction = 1,
    settings.FileSourceSettings = fileSourceSettings;
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

  private postChannelActions(fileSourceActions: FileSourceActions) {
    const actions: ChannelActions = <ChannelActions>{};
    actions.channelType = 'FileSource';
    actions.direction = 1,
    actions.FileSourceActions = fileSourceActions;
    this.channeldetailsService.postAction(this.sdrangelURL, this.deviceIndex, this.channelIndex, actions).subscribe(
      res => {
        this.statusMessage = 'OK';
        this.statusError = false;
      },
      error => {
        this.statusMessage = 'Cannot post record action';
        this.statusError = true;
      }
    );
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === 'FileSource') {
                this.report = channelReport.FileSourceReport;
              }
            }
          );
        }
      );
    } else {
      this.channelReportSubscription.unsubscribe();
      this.channelReportSubscription = null;
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
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setChannelSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.title = this.settings.title;
    this.setChannelSettings(newSettings);
  }

  setFileName() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.fileName = this.settings.fileName;
    this.setChannelSettings(newSettings);
  }

  setLoop() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.loop = this.loop ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setLog2Interp() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.log2Interp = this.settings.log2Interp;
    this.setChannelSettings(newSettings);
    this.maxFixedShiftIndex = this.getNbFixedShiftIndexes(this.settings.log2Interp);
    if (this.settings.filterChainHash > this.maxFixedShiftIndex) {
      const newSettings2: FileSourceSettings = <FileSourceSettings>{};
      newSettings2.filterChainHash = this.maxFixedShiftIndex;
      this.setChannelSettings(newSettings);
    }
  }

  setGainDB() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.gainDB = this.settings.gainDB;
    this.setChannelSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setChannelSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setChannelSettings(newSettings);
  }

  setFrequencyPosition() {
    this.validateFixedFreqPosition();
    const newSettings: FileSourceSettings = <FileSourceSettings>{};
    newSettings.filterChainHash = this.settings.filterChainHash > this.maxFixedShiftIndex ? this.maxFixedShiftIndex : this.settings.filterChainHash;
    this.setChannelSettings(newSettings);
  }

  validateFixedFreqPosition() {
    if (this.fixedShiftIndex >= this.maxFixedShiftIndex) {
      this.fixedShiftIndex = this.maxFixedShiftIndex > 0 ? this.maxFixedShiftIndex - 1 : 0;
    }
    if (this.fixedShiftIndex < 0) {
      this.fixedShiftIndex = 0;
    }
  }

  getNbFixedShiftIndexes(log2Decim: number) {
    if (log2Decim < 0) {
      return 0;
    } else {
      return (2 * (1 << log2Decim)) - 1;
    }
  }
}
