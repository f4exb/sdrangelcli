import { Component, OnInit } from '@angular/core';
import { LocalSourceSettings, LOCALSOURCE_SETTINGS_DEFAULT } from './local-source';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChannelDetailsService } from '../channel-details.service';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { DeviceStoreService } from 'src/app/device-store.service';
import { Utils } from 'src/app/common-components/utils';
import { ChannelSettings } from '../channel-details';

interface Log2 {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-local-source',
  templateUrl: './local-source.component.html',
  styleUrls: ['./local-source.component.css']
})
export class LocalSourceComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: LocalSourceSettings = LOCALSOURCE_SETTINGS_DEFAULT;
  deviceCenterFrequency: number;
  deviceBasebandRate: number;
  deviceStoreSubscription: Subscription;
  channelReportSubscription: Subscription;
  channelDeltaFrequency: number;
  channelCenterFrequencyKhz: number;
  monitor: boolean;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  log2Interps: Log2[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  useReverseAPI: boolean;

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

  ngOnInit() {
    this.deviceIndex = +this.route.snapshot.parent.params['dix'];
    this.channelIndex = +this.route.snapshot.parent.params['cix'];
    this.getDeviceStorage();
    this.getChannelSettings();
  }

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'LocalSource') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.LocalSourceSettings;
          this.channelDeltaFrequency = this.calculateFrequencyOffset();
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a LocalSource channel';
          this.statusError = true;
        }
      }
    );
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

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  private setDeviceSettings(localSourceSettings: LocalSourceSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'LocalSource';
    settings.direction = 1,
    settings.LocalSourceSettings = localSourceSettings;
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
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setInterp() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.log2Interp = this.settings.log2Interp;
    this.setDeviceSettings(newSettings);
  }

  setFilterChainHash() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.filterChainHash = this.settings.filterChainHash;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: LocalSourceSettings = <LocalSourceSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  getChannelBaseband(): number {
    return (this.deviceBasebandRate / 1000) / (1 << this.settings.log2Interp);
  }

  getMaxFilterChainHash(): number {
    return 3 ** this.settings.log2Interp;
  }

  getFilterChainString(): string {
    return Utils.convertHBFilterChainToString(this.settings.log2Interp, this.settings.filterChainHash);
  }

  calculateFrequencyOffset(): number {
    return this.deviceBasebandRate * Utils.getHBFilterChainShiftFactor(this.settings.log2Interp, this.settings.filterChainHash);
  }

}
