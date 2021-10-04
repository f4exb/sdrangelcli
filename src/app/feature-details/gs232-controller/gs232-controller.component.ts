import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utils } from 'src/app/common-components/utils';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { FeatureSettings } from '../feature-details';
import { FeatureDetailsService } from '../feature-details.service';
import { GS232ControllerSettings, GS232_CONTROLLER_SETTINGS_MOCK } from './gs232-controller';

export interface Source {
  value: string;
  viewValue: string;
}

export interface SerialPort {
  value: string;
  viewValue: string;
}

export interface Protocol {
  value: number;
  viewValue: string;
}

export interface BaudRate {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-gs232-controller',
  templateUrl: './gs232-controller.component.html',
  styleUrls: ['./gs232-controller.component.css']
})
export class Gs232ControllerComponent implements OnInit {
  @Output() featuresetChanged = new EventEmitter();
  featuresetIndex: number;
  featureIndex: number;
  sdrangelURL: string;
  settings: GS232ControllerSettings = GS232_CONTROLLER_SETTINGS_MOCK;
  statusMessage: string;
  statusError = false;
  sources: Source[] = [];
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  useReverseAPI: boolean;
  track: boolean;
  serialPorts: SerialPort[] = [];
  protocols: Protocol[] = [
    {value: 0, viewValue: 'GS-232'},
    {value: 1, viewValue: 'SPID'}
  ];
  baudRates: BaudRate[] = [
    {value: 1200, viewValue: '1200'},
    {value: 2400, viewValue: '2400'},
    {value: 4800, viewValue: '4800'},
    {value: 9600, viewValue: '9600'},
    {value: 19200, viewValue: '19200'},
    {value: 38400, viewValue: '38400'},
    {value: 57600, viewValue: '57600'},
    {value: 115200, viewValue: '115200'},
    {value: 230400, viewValue: '230400'},
    {value: 460800, viewValue: '460800'}
  ];

  constructor(private route: ActivatedRoute,
    private featuredetailsService: FeatureDetailsService,
    private sdrangelUrlService: SdrangelUrlService) {
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit(): void {
    this.featuresetIndex = +this.route.snapshot.parent.params['dix'];
    this.featureIndex = +this.route.snapshot.parent.params['cix'];
    this.getFeatureSettings();
    this.getFeatureReport();
  }

  getFeatureSettings() {
    this.featuredetailsService.getSettings(this.sdrangelURL, this.featuresetIndex, this.featureIndex).subscribe(
      featureSettings => {
        if (featureSettings.featureType === 'GS232Controller') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = featureSettings.GS232ControllerSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.track = this.settings.track !== 0;
        } else {
          this.statusMessage = 'Not a GS232Controller feature';
          this.statusError = true;
        }
      }
    );
  }

  private setFeatureSettings(gs232ControllerSettings: GS232ControllerSettings) {
    const settings: FeatureSettings = <FeatureSettings>{};
    settings.featureType = 'GS232Controller';
    settings.GS232ControllerSettings = gs232ControllerSettings;
    this.featuredetailsService.setSettings(this.sdrangelURL, this.featuresetIndex, this.featureIndex, settings).subscribe(
      res => {
        console.log('Set settings OK', res);
        this.statusMessage = 'OK';
        this.statusError = false;
        this.getFeatureSettings();
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

  private getFeatureReport() {
    this.featuredetailsService.getReport(this.sdrangelURL, this.featuresetIndex, this.featureIndex).subscribe(
      featureReport => {
        if (featureReport.featureType === 'GS232Controller') {
          this.statusMessage = 'OK';
          this.statusError = false;
          const reportedSources = featureReport.GS232ControllerReport.sources;
          reportedSources.forEach((element, index) => {
            this.sources.push({
              value: element,
              viewValue: element
            });
          });
          const reportedSerialPorts = featureReport.GS232ControllerReport.serialPorts;
          reportedSerialPorts.forEach((element, index) => {
            this.serialPorts.push({
              value: element,
              viewValue: element
            });
          });
        } else {
          this.statusMessage = 'Not a RTLSDR device';
          this.statusError = true;
        }
      }
    );
  }

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setFeatureSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.title = this.settings.title;
    this.setFeatureSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIFeatureSetIndex() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.reverseAPIFeatureSetIndex = this.settings.reverseAPIFeatureSetIndex;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIFeatureIndex() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.reverseAPIFeatureIndex = this.settings.reverseAPIFeatureIndex;
    this.setFeatureSettings(newSettings);
  }

  setAzimuth() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.azimuth = this.settings.azimuth;
    this.setFeatureSettings(newSettings);
  }

  setElevation() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.elevation = this.settings.elevation;
    this.setFeatureSettings(newSettings);
  }

  setTracking() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.track = this.track ? 1 : 0;
    this.setFeatureSettings(newSettings);
  }

  setSource() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.source = this.settings.source;
    this.setFeatureSettings(newSettings);
  }

  setProtocol() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.protocol = this.settings.protocol;
    this.setFeatureSettings(newSettings);
  }

  setTolerance() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.tolerance = this.settings.tolerance;
    this.setFeatureSettings(newSettings);
  }

  setSerialPort() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.serialPort = this.settings.serialPort;
    this.setFeatureSettings(newSettings);
  }

  setBaudRate() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.baudRate = this.settings.baudRate;
    this.setFeatureSettings(newSettings);
  }

  setAzimuthOffset() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.azimuthOffset = this.settings.azimuthOffset;
    this.setFeatureSettings(newSettings);
  }

  setAzimuthMin() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.azimuthMin = this.settings.azimuthMin;
    this.setFeatureSettings(newSettings);
  }

  setAzimuthMax() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.azimuthMax = this.settings.azimuthMax;
    this.setFeatureSettings(newSettings);
  }

  setElevationOffset() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.elevationOffset = this.settings.elevationOffset;
    this.setFeatureSettings(newSettings);
  }

  setElevationMin() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.elevationMin = this.settings.elevationMin;
    this.setFeatureSettings(newSettings);
  }

  setElevationMax() {
    const newSettings: GS232ControllerSettings = <GS232ControllerSettings>{};
    newSettings.elevationMax = this.settings.elevationMax;
    this.setFeatureSettings(newSettings);
  }
}
