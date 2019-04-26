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

export interface Log2Decim {
  value: number;
  viewValue: number;
}

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
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  maxFilterChainHash: number;
  filterChainCode: string;
  shift: number;
  channelDeltaFrequency: number;
  useReverseAPI: boolean;
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

  getChannelSettings() {
    this.channeldetailsService.getSettings(this.sdrangelURL, this.deviceIndex, this.channelIndex).subscribe(
      channelSettings => {
        if (channelSettings.channelType === 'RemoteSink') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = channelSettings.RemoteSinkSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = Utils.getRGBStr(this.rgbTitle);
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.setFiterChainHashMax();
          this.calcuateFilterChain();
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

  getDeltaFrequency(): number {
    const frequency = (this.shift * this.deviceBasebandRate) / 1000;
    return +frequency.toFixed(3);
  }

  getCenterFrequency(): number {
    const frequency = ((this.shift * this.deviceBasebandRate) + this.deviceCenterFrequency) / 1000;
    return +frequency.toFixed(3);
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

  setLog2Decim() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.log2Decim = this.settings.log2Decim;
    this.setFiterChainHashMax();
    this.setDeviceSettings(newSettings);
  }

  setFilterChainHash() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.filterChainHash = this.settings.filterChainHash;
    this.calcuateFilterChain();
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIDeviceIndex() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.reverseAPIDeviceIndex = this.settings.reverseAPIDeviceIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIChannelIndex() {
    const newSettings: RemoteSinkSettings = <RemoteSinkSettings>{};
    newSettings.reverseAPIChannelIndex = this.settings.reverseAPIChannelIndex;
    this.setDeviceSettings(newSettings);
  }

  private setFiterChainHashMax() {
    this.maxFilterChainHash = Math.pow(3, this.settings.log2Decim) - 1;
  }

  private calcuateFilterChain() {
    if (this.settings.log2Decim === 0) {
      this.filterChainCode = 'C';
      this.shift = 0.0;
    }

    const u = this.settings.filterChainHash;
    const s = u.toString(3);
    let ix = this.settings.log2Decim;
    this.filterChainCode = '';
    this.shift = 0.0;
    const d = Math.pow(2, this.settings.log2Decim);
    let shift_stage = 0.5 / d;

    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      let r: number;
      if (c === '0') {
        this.filterChainCode += 'L';
        r = -1;
      } else if (c === '1') {
        this.filterChainCode += 'C';
        r = 0;
      } else if (c === '2') {
        this.filterChainCode += 'H';
        r = 1;
      }
      this.shift += r * shift_stage;
      shift_stage *= 2;
      ix--;
    }

    // continue shift with leading zeroes. ix has the number of leading zeroes.
    for (let i = 0; i < ix; i++) {
      this.filterChainCode = 'L' + this.filterChainCode;
      this.shift -= shift_stage;
      shift_stage *= 2;
    }
  }
}
