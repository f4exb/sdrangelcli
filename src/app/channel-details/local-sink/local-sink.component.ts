import { Component, OnInit } from '@angular/core';
import { LocalSinkSettings, LOCALSINK_SETTINGS_DEFAULT } from './local-sink';
import { Subscription, interval } from 'rxjs';
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
  selector: 'app-local-sink',
  templateUrl: './local-sink.component.html',
  styleUrls: ['./local-sink.component.css']
})
export class LocalSinkComponent implements OnInit {
  deviceIndex: number;
  channelIndex: number;
  sdrangelURL: string;
  settings: LocalSinkSettings = LOCALSINK_SETTINGS_DEFAULT;
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
  log2Decims: Log2[] = [
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
        if (channelSettings.channelType === 'LocalSink') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.LocalSinkSettings;
          this.channelDeltaFrequency = this.calculateFrequencyOffset();
          this.channelCenterFrequencyKhz = (this.deviceCenterFrequency + this.channelDeltaFrequency) / 1000;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not a LocalSink channel';
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

  private setDeviceSettings(localSinkSettings: LocalSinkSettings) {
    const settings: ChannelSettings = <ChannelSettings>{};
    settings.channelType = 'LocalSink';
    settings.direction = 0,
    settings.LocalSinkSettings = localSinkSettings;
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
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setDecim() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setDeviceSettings(newSettings);
  }

  setFilterChainHash() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.filterChainHash = this.settings.filterChainHash;
    this.setDeviceSettings(newSettings);
  }

  setLocalDeviceIndex() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.localDeviceIndex = this.settings.localDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: LocalSinkSettings = <LocalSinkSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  getChannelBaseband(): number {
    return (this.deviceBasebandRate / 1000) / (1 << this.settings.log2Decim);
  }

  getMaxFilterChainHash(): number {
    return 3 ** this.settings.log2Decim;
  }

  getFilterChainString(): string {
    return this.convertToString(this.settings.log2Decim, this.settings.filterChainHash);
  }

  calculateFrequencyOffset(): number {
    return this.deviceBasebandRate * this.getShiftFactor(this.settings.log2Decim, this.settings.filterChainHash);
  }

  private getShiftFactor(log2: number, chainHash: number): number {
    if (log2 === 0) {
      return 0;
    }

    const s = 3 ** log2;
    let u = chainHash % s; // scale

    let ix = log2;
    let shift = 0;
    let shift_stage = 1 / (2 ** (log2 + 1));

    // base3 conversion
    do {
        const r = u % 3;
        shift += (r - 1) * shift_stage;
        shift_stage *= 2;
        u = Math.floor(u / 3); // Euclidean division
        ix--;
    } while (u);

    // continue shift with leading zeroes. ix has the number of leading zeroes.
    for (let i = 0; i < ix; i++) {
        shift -= shift_stage;
        shift_stage *= 2;
    }

    return shift;
  }

  private convertToString(log2: number, chainHash: number): string {
    if (log2 === 0) {
        return 'C';
    }

    const s = 3 ** log2;
    let u = chainHash % s; // scale
    let chainString = '';
    let ix = log2;

    // base3 conversion
    do {
        const r = u % 3;

        if (r === 0) {
            chainString = 'L' + chainString;
        } else if (r === 1) {
            chainString = 'C' + chainString;
        } else if (r === 2) {
            chainString = 'H' + chainString;
        }

        u = Math.floor(u / 3); // Euclidean division
        ix--;
    } while (u);

    // continue shift with leading zeroes. ix has the number of leading zeroes.
    for (let i = 0; i < ix; i++) {
        chainString = 'L' + chainString;
    }

    return chainString;
  }
}
