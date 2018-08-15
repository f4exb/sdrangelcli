import { Component, OnInit } from '@angular/core';
import { UDPSrcSettings, UDPSrcReport } from './udp-source';
import { Subscription, interval } from 'rxjs';
import { AudioDeviceInfo } from '../nfm-demod/nfm-demod.component';
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
  selector: 'app-udp-source',
  templateUrl: './udp-source.component.html',
  styleUrls: ['./udp-source.component.css']
})
export class UdpSourceComponent implements OnInit {
  sampleFormats: SampleFormat[] = [
    {value: 0, viewValue: "I/Q 16bits"},
    {value: 1, viewValue: "I/Q 24bits"},
    {value: 2, viewValue: "NFM"},
    {value: 3, viewValue: "NFM mono"},
    {value: 4, viewValue: "LSB"},
    {value: 5, viewValue: "USB"},
    {value: 6, viewValue: "LSB mono"},
    {value: 7, viewValue: "USB mono"},
    {value: 8, viewValue: "AM"},
    {value: 9, viewValue: "AM no DC"},
    {value: 10, viewValue: "AM BPF"},
  ]
  rfBandwidthKhz: number;
  fmDeviationKhz: number;
  squelchGateMs: number;
  agc: boolean;
  audioActive: boolean;
  audioStereo: boolean;
  channelMute: boolean;
  squelchEnabled: boolean;
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings: UDPSrcSettings;
  report: UDPSrcReport;
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
        if (channelSettings.channelType == "SSBDemod") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.UDPSrcSettings;
          this.channelDeltaFrequency = this.settings.inputFrequencyOffset;
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency)/1000;
          this.channelMaxFrequencyKhz = (this.deviceCenterFrequency + (this.deviceBasebandRate/2))/1000;
          this.channelMinFrequencyKhz = (this.deviceCenterFrequency - (this.deviceBasebandRate/2))/1000;
          this.rfBandwidthKhz = this.settings.rfBandwidth/1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.settings.volume = +this.settings.volume.toFixed(0);
          this.agc = this.settings.agc !== 0;
          this.audioActive = this.settings.audioActive !== 0;
          this.audioStereo = this.settings.audioStereo !== 0;
          this.channelMute = this.settings.channelMute !== 0;
          this.squelchEnabled = this.settings.squelchEnabled !== 0;
        } else {
          this.statusMessage = "Not a SSBDemod channel";
          this.statusError = true;
        }
      }
    )
  }

  private setDeviceSettings(udpSrcSettings : UDPSrcSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "UDPSrc";
    settings.tx = 0,
    settings.UDPSrcSettings = udpSrcSettings;
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
              if (channelReport.channelType === "UDPSrc") {
                this.report = channelReport.UDPSrcReport;
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
    const newSettings: UDPSrcSettings = <UDPSrcSettings>{};
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
    const newSettings: UDPSrcSettings = <UDPSrcSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: UDPSrcSettings = <UDPSrcSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setChannelMute() {
    const newSettings: UDPSrcSettings = <UDPSrcSettings>{};
    newSettings.channelMute = this.channelMute ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setVolume() {
    const newSettings: UDPSrcSettings = <UDPSrcSettings>{};
    newSettings.volume = this.settings.volume;
    this.setDeviceSettings(newSettings);
  }

  setAGC() {
    const newSettings: UDPSrcSettings = <UDPSrcSettings>{};
    newSettings.agc = this.agc ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

}
