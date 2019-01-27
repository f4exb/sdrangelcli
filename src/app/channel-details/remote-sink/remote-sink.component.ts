import { Component, OnInit } from '@angular/core';
import { RemoteSinkSettings, REMOTE_SINK_SETTINGS_DEFAULT } from './remote-sink';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from '../../deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceStoreService } from '../../device-store.service';
import { Utils } from '../../common-components/utils';
import { ChannelSettings } from '../channel-details';

@Component({
  selector: 'app-remote-sink',
  templateUrl: './remote-sink.component.html',
  styleUrls: ['./remote-sink.component.css']
})
export class RemoteSinkComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: RemoteSinkSettings = REMOTE_SINK_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private channeldetailsService: ChannelDetailsService,
    private deviceSetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
      this.deviceStoreSubscription = null;
      this.channelReportSubscription = null;
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
        if (channelSettings.channelType === 'RemoteSink') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.RemoteSinkSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
        } else {
          this.statusMessage = 'Not a RemoteSink channel';
          this.statusError = true;
        }
      }
    );
  }

  private setDeviceSettings(remoteSinkSettings: RemoteSinkSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'RemoteSink';
    settings.tx = 0,
    settings.RemoteSinkSettings = remoteSinkSettings;
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

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setDataAddress() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.dataAddress = this.settings.dataAddress;
    this.setDeviceSettings(newSettings);
  }

  setDataPort() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.dataPort = this.settings.dataPort;
    this.setDeviceSettings(newSettings);
  }

  setNbFECBlocks() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.nbFECBlocks = this.settings.nbFECBlocks;
    this.setDeviceSettings(newSettings);
  }

  setTxDelay() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.txDelay = this.settings.txDelay;
    this.setDeviceSettings(newSettings);
  }
}
