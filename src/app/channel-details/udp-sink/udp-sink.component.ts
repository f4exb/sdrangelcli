import { Component, OnInit } from '@angular/core';
import { UDPSinkSettings, UDP_SINK_SETTINGS_DEFAULT, UDPSinkReport, UDP_SINK_REPORT_DEFAULT } from './udp-sink';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

interface SampleFormat {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-udp-sink',
  templateUrl: './udp-sink.component.html',
  styleUrls: ['./udp-sink.component.css']
})
export class UdpSinkComponent implements OnInit {
  sampleFormats: SampleFormat[] = [
    {value: 0, viewValue: "SnLE I/Q"},
    {value: 1, viewValue: "S16LE NFM"},
    {value: 2, viewValue: "S16LE LSB"},
    {value: 3, viewValue: "S16LE USB"},
    {value: 4, viewValue: "S16LE AM"},
  ];
  amPercent: number;
  autoRWBalance: boolean;
  channelMute: boolean;
  fmDeviationKhz: number;
  rfBandwidthKhz: number;
  lowCutoffKhz: number;
  squelchGateMs: number;
  stereoInput: boolean;
  squelchEnabled: boolean;
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: UDPSinkSettings = UDP_SINK_SETTINGS_DEFAULT;
  report: UDPSinkReport = UDP_SINK_REPORT_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription : Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  channelMinFrequencyKhz: number;
  channelMaxFrequencyKhz: number;
  statusMessage: string;
  statusError: boolean = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr: string = 'rgb(0,0,0)'
  monitor: boolean;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService)
  {
    this.deviceStoreSubscription = null;
    this.channelReportSubscription = null;
    this.monitor = false;
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix']
    this.channelIndex = +this.route.snapshot.parent.params['cix']
    this.getDeviceStorage();
    this.getChannelSettings();
  }

  ngOnDestroy() {
    (this.deviceStoreSubscription) && this.deviceStoreSubscription.unsubscribe();
    (this.channelReportSubscription) && this.channelReportSubscription.unsubscribe();
  }

  private getDeviceStorage() {
    this.deviceStoreSubscription = this.deviceStoreService.get(this.deviceIndex).subscribe(
      deviceStorage => {
        this.deviceCenterFrequency = deviceStorage.centerFrequency;
        this.deviceBasebandRate = deviceStorage.basebandRate;
      },
      error => {
        if (error == "No device at this index") {
          this.deviceSetService.getInfo(this.sdrangelURL, this.deviceIndex).subscribe(
            deviceset => {
              this.deviceStoreService.change(
                this.deviceIndex,
                {
                  basebandRate: deviceset.samplingDevice.bandwidth,
                  centerFrequency: deviceset.samplingDevice.centerFrequency
                }
              )
              this.deviceBasebandRate = deviceset.samplingDevice.bandwidth;
              this.deviceCenterFrequency = deviceset.samplingDevice.centerFrequency;
            }
          )
        }
      }
    )
  }

  private getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType == "UDPSink") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.UDPSinkSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency)/1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate/2))/1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate/2))/1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth/1000;
          this.lowCutoffKhz = this.settings.lowCutoff/1000;
          this.fmDeviationKhz = this.settings.fmDeviation/1000;
          this.amPercent = +(this.settings.amModFactor*100).toFixed(0);
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.channelMute = this.settings.channelMute !== 0;
          this.squelchEnabled = this.settings.squelchEnabled !== 0;
          this.autoRWBalance = this.settings.autoRWBalance !== 0;
          this.stereoInput = this.settings.stereoInput !== 0;
          this.settings.gainIn = +this.settings.gainIn.toFixed(1)
          this.settings.gainOut = +this.settings.gainOut.toFixed(1)
          this.squelchGateMs = +(this.settings.squelchGate*1000).toFixed(0);
        } else {
          this.statusMessage = "Not a UDPSink channel";
          this.statusError = true;
        }
      }
    )
  }

  private setDeviceSettings(udpSinkSettings : UDPSinkSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "UDPSink";
    settings.tx = 1,
    settings.UDPSinkSettings = udpSinkSettings;
    this.channeldetailsService.setSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex, settings).subscribe(
      res => {
        console.log("Set settings OK", res);
        this.statusMessage = "OK";
        this.statusError = false;
        this.getChannelSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    )
  }

  enableReporting(enable: boolean) {
    if (enable) {
      this.channelReportSubscription = interval(1000).subscribe(
        _ => {
          this.channeldetailsService.getReport(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
            channelReport => {
              if (channelReport.channelType === "UDPSink") {
                this.report = channelReport.UDPSinkReport;
              }
            }
          )
        }
      )
    } else {
      this.channelReportSubscription.unsubscribe();
      this.channelReportSubscription = null;
    }
  }

  toggleMonitor() {
    this.monitor = !this.monitor;
    this.enableReporting(this.monitor);
  }

  onFrequencyUpdate(frequency: number) {
    this.channelCenterFrequencyKhz = frequency;
    this.setCenterFrequency();
  }

  setCenterFrequency() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.inputFrequencyOffset = this.channelCenterFrequencyKhz * 1000 - this.deviceCenterFrequency;
    this.setDeviceSettings(newSettings);
  }

  getDeltaFrequency() : number {
    let frequency = this.channelCenterFrequencyKhz - (this.deviceCenterFrequency/1000);
    return +frequency.toFixed(3);
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setGainIn() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.gainIn = this.settings.gainIn;
    this.setDeviceSettings(newSettings);
  }

  setGainOut() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.gainOut = this.settings.gainOut;
    this.setDeviceSettings(newSettings);
  }

  setSampleFormat() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.sampleFormat = this.settings.sampleFormat;
    this.setDeviceSettings(newSettings);
  }

  setAddress() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.udpAddress = this.settings.udpAddress;
    this.setDeviceSettings(newSettings);
  }

  setPort() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.udpPort = this.settings.udpPort;
    this.setDeviceSettings(newSettings);
  }

  setSampleRate() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.inputSampleRate = this.settings.inputSampleRate;
    this.setDeviceSettings(newSettings);
  }

  setBandwidth() {
    this.validateLowCutoff();
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.rfBandwidth = this.rfBandwidthKhz*1000;
    this.setDeviceSettings(newSettings);
  }

  setLowCutoff() {
    this.validateLowCutoff();
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.lowCutoff = this.lowCutoffKhz*1000;
    this.setDeviceSettings(newSettings);
  }

  private validateLowCutoff() {
    if (this.lowCutoffKhz > this.rfBandwidthKhz) {
      this.lowCutoffKhz = this.rfBandwidthKhz;
    } else if (this.lowCutoffKhz < 0) {
      this.lowCutoffKhz = 0;
    }
  }

  setFMDeviation() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.fmDeviation = this.fmDeviationKhz*1000;
    this.setDeviceSettings(newSettings);
  }

  setAmModFactor() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.amModFactor = this.amPercent/100;
    this.setDeviceSettings(newSettings);
  }

  setSquelchEnabled() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.squelchEnabled = this.squelchEnabled ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setSquelch() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.squelch = this.settings.squelch;
    this.setDeviceSettings(newSettings);
  }

  setSquelchGate() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.squelchGate = this.squelchGateMs/1000;
    this.setDeviceSettings(newSettings);
  }

  setStereoInput() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.stereoInput = this.stereoInput ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setAutoRWBalance() {
    const newSettings: UDPSinkSettings = <UDPSinkSettings>{};
    newSettings.autoRWBalance = this.autoRWBalance ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }
}
