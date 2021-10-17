import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Utils } from 'src/app/common-components/utils';
import { DeviceStoreService } from 'src/app/device-store.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { ChannelActions, ChannelSettings } from '../channel-details';
import { ChannelDetailsService } from '../channel-details.service';
import { FileSinkActions, FileSinkReport, FileSinkSettings, FILESINK_ACTIONS_DEFAULT, FILESINK_REPORT_DEFAULT, FILESINK_SETTINGS_DEFAULT } from './file-sink';

export interface Log2Decim {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-file-sink',
  templateUrl: './file-sink.component.html',
  styleUrls: ['./file-sink.component.css']
})
export class FileSinkComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: FileSinkSettings = FILESINK_SETTINGS_DEFAULT;
  report: FileSinkReport = FILESINK_REPORT_DEFAULT;
  actions: FileSinkActions = FILESINK_ACTIONS_DEFAULT;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  spectrumSquelchMode: boolean;
  squelchRecordingEnable: boolean;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  monitor: boolean;
  useReverseAPI: boolean;
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  fixedFreqPosition: boolean;
  fixedShiftIndex = 0;
  maxFixedShiftIndex = 0;
  recording = false;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
      this.deviceStoreSubscription = null;
      this.channelReportSubscription = null;
      this.monitor = false;
      this.fixedFreqPosition = false;
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
        if (channelSettings.channelType === 'FileSink') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.FileSinkSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate / 2)) / 1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate / 2)) / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.spectrumSquelchMode = this.settings.spectrumSquelchMode !== 0;
          this.squelchRecordingEnable = this.settings.squelchRecordingEnable !== 0;
          this.maxFixedShiftIndex = this.getNbFixedShiftIndexes(this.settings.log2Decim);
          this.setPosFromFrequency();
        } else {
          this.statusMessage = 'Not a FileSink channel';
          this.statusError = true;
        }
      }
    );
  }

  private postChannelActions(fileSinkActions: FileSinkActions) {
    const actions: ChannelActions = <ChannelActions>{};
    actions.channelType = 'FileSink';
    actions.direction = 0,
    actions.FileSinkActions = fileSinkActions;
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

  private setDeviceSettings(fileSinkSettibgs: FileSinkSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'FileSink';
    settings.direction = 0,
    settings.FileSinkSettings = fileSinkSettibgs;
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
              if (channelReport.channelType === 'FileSink') {
                this.report = channelReport.FileSinkReport;
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

  getSpectrumSquelchStatusColor() {
    if (this.report.spectrumSquelch) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getSpectrumSquelchStatusText() {
    if (this.report.spectrumSquelch) {
      return 'Spectrum squelch on';
    } else {
      return 'Spectrum squelch off';
    }
  }

  getSpectrumMaxdB() {
    if (this.report.spectrumMax > 0) {
      return 10 * Math.log10(this.report.spectrumMax);
    } else {
      return -120;
    }
  }

  getRecordingColor() {
    if (this.report.recording) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  getRecordingText() {
    if (this.report.recording) {
      return 'Recording';
    } else {
      return 'Not recording';
    }
  }

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
    this.setPosFromFrequency();
  }

  getDeltaFrequency(): number {
    const frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency / 1000);
    return +frequency.toFixed(3);
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setFileName() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.fileRecordName = this.settings.fileRecordName;
    this.setDeviceSettings(newSettings);
  }

  setLog2Decim() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
    this.maxFixedShiftIndex = this.getNbFixedShiftIndexes(this.settings.log2Decim);
    this.fixedShiftIndex = this.fixedShiftIndex > this.maxFixedShiftIndex ? this.maxFixedShiftIndex : this.fixedShiftIndex;
  }

  setSpectrumSquelchMode() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.spectrumSquelchMode = this.spectrumSquelchMode ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSpectrumSquelch() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.spectrumSquelch = this.settings.spectrumSquelch;
    this.setDeviceSettings(newSettings);
  }

  setSquelchRecordingEnable() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.squelchRecordingEnable = this.squelchRecordingEnable ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setPreRecordTime() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.preRecordTime = this.settings.preRecordTime;
    this.setDeviceSettings(newSettings);
  }

  setSquelchPostRecordTime() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.squelchPostRecordTime = this.settings.squelchPostRecordTime;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  setFrequencyFromPos() {
    const inputFrequencyOffset = this.getOffsetFromFixedShiftIndex(this.deviceBasebandRate,
      this.settings.log2Decim,
      this.fixedShiftIndex);
    const newSettings: FileSinkSettings = <FileSinkSettings>{};
    newSettings.inputFrequencyOffset = inputFrequencyOffset;
    this.setDeviceSettings(newSettings);
  }

  setPosFromFrequency() {
    const fshift = this.getHalfBand(this.deviceBasebandRate, this.settings.log2Decim + 1);
    const fixedShiftIndex = Math.floor(this.getFixedShiftIndexFromOffset(
      this.deviceBasebandRate,
      this.settings.log2Decim,
      this.settings.inputFrequencyOffset + (this.settings.inputFrequencyOffset < 0 ? -fshift : fshift)));
    this.fixedShiftIndex = fixedShiftIndex < 0 ? 0 : fixedShiftIndex;
  }

  setFixedFreqPosition() {
    this.validateFixedFreqPosition();
    if (this.fixedFreqPosition) {
      this.setFrequencyFromPos();
    }
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

  getHalfBand(sampleRate: number, log2Decim: number) {
    if (log2Decim < 0) {
      return 0;
    } else {
      return sampleRate / (2 * (1 << log2Decim));
    }
  }

  getFixedShiftIndexFromOffset(sampleRate: number, log2Decim: number, frequencyOffset: number) {
    if ((sampleRate === 0) || (log2Decim < 0)) {
      return 0;
    } else {
      const decim = 1 << log2Decim;
      const mid = decim - 1;
      return ((frequencyOffset * 2 * decim) / sampleRate) + mid;
    }
  }

  getOffsetFromFixedShiftIndex(sampleRate: number, log2Decim: number, shiftIndex: number) {
    const decim = 1 << log2Decim;
    const mid = decim - 1;
    return ((shiftIndex - mid) * sampleRate) / (2 * decim);
  }

  toggleRecording() {
    this.recording = !this.recording;
    const newActions: FileSinkActions = <FileSinkActions>{};
    newActions.record = this.recording ? 1 : 0;
    this.postChannelActions(newActions);
  }

  getRecordActionColor() {
    if (this.recording) {
      return 'red';
    } else {
      return 'grey';
    }
  }
}
