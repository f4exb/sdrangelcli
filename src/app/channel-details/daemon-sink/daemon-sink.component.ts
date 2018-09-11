import { Component, OnInit } from '@angular/core';
import { DaemonSinkSettings, DAEMON_SINK_SETTINGS_DEFAULT } from './daemon-sink';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

@Component({
  selector: 'app-daemon-sink',
  templateUrl: './daemon-sink.component.html',
  styleUrls: ['./daemon-sink.component.css']
})
export class DaemonSinkComponent implements OnInit {
  deviceIndex : number;
  channelIndex: number;
  sdrangelURL : string;
  settings : DaemonSinkSettings = DAEMON_SINK_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  statusMessage: string;
  statusError: boolean = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr: string = 'rgb(0,0,0)'
  deviceStoreSubscription : Subscription;
  channelReportSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService)
  {
    this.deviceStoreSubscription = null;
    this.channelReportSubscription = null;
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
        if (channelSettings.channelType == "DaemonSink") {
          this.statusMessage = "OK";
          this.statusError = false;
          this.settings = channelSettings.DaemonSinkSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
        } else {
          this.statusMessage = "Not a DaemonSink channel";
          this.statusError = true;
        }
      }
    )
  }

  private setDeviceSettings(daemonSinkSettings : DaemonSinkSettings) {
    const settings : ChannelSettings = <ChannelSettings>{};
    settings.channelType = "DaemonSink";
    settings.tx = 0,
    settings.DaemonSinkSettings = daemonSinkSettings;
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

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: DaemonSinkSettings = <DaemonSinkSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: DaemonSinkSettings = <DaemonSinkSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setDataAddress() {
    const newSettings: DaemonSinkSettings = <DaemonSinkSettings>{};
    newSettings.dataAddress = this.settings.dataAddress;
    this.setDeviceSettings(newSettings);
  }

  setDataPort() {
    const newSettings: DaemonSinkSettings = <DaemonSinkSettings>{};
    newSettings.dataPort = this.settings.dataPort;
    this.setDeviceSettings(newSettings);
  }

  setNbFECBlocks() {
    const newSettings: DaemonSinkSettings = <DaemonSinkSettings>{};
    newSettings.nbFECBlocks = this.settings.nbFECBlocks;
    this.setDeviceSettings(newSettings);
  }

  setTxDelay() {
    const newSettings: DaemonSinkSettings = <DaemonSinkSettings>{};
    newSettings.txDelay = this.settings.txDelay;
    this.setDeviceSettings(newSettings);
  }
}
