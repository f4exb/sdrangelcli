import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utils } from 'src/app/common-components/utils';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { FeatureSettings } from '../feature-details';
import { FeatureDetailsService } from '../feature-details.service';
import { AISSettings, AIS_SETTINGS_DEFAULT } from './ais';

@Component({
  selector: 'app-ais',
  templateUrl: './ais.component.html',
  styleUrls: ['./ais.component.css']
})
export class AisComponent implements OnInit {
  featureIndex: number;
  sdrangelURL: string;
  settings: AISSettings = AIS_SETTINGS_DEFAULT;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private featuredetailsService: FeatureDetailsService,
    private sdrangelUrlService: SdrangelUrlService) {
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit(): void {
    this.featureIndex = +this.route.snapshot.parent.params['cix'];
    this.getFeatureSettings();
  }

  getFeatureSettings() {
    this.featuredetailsService.getSettings(this.sdrangelURL, this.featureIndex).subscribe(
      featureSettings => {
        if (featureSettings.featureType === 'AIS') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = featureSettings.AISSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
        } else {
          this.statusMessage = 'Not an AIS feature';
          this.statusError = true;
        }
      }
    );
  }

  private setDeviceSettings(aisSettings: AISSettings) {
    const settings: FeatureSettings = <FeatureSettings>{};
    settings.featureType = 'AIS';
    settings.AISSettings = aisSettings;
    this.featuredetailsService.setSettings(this.sdrangelURL, this.featureIndex, settings).subscribe(
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

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setTitleColor() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setDeviceSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.title = this.settings.title;
    this.setDeviceSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIFeatureSetIndex() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.reverseAPIFeatureSetIndex = this.settings.reverseAPIFeatureSetIndex;
    this.setDeviceSettings(newSettings);
  }

  setReverseAPIFeatureIndex() {
    const newSettings: AISSettings = <AISSettings>{};
    newSettings.reverseAPIFeatureIndex = this.settings.reverseAPIFeatureIndex;
    this.setDeviceSettings(newSettings);
  }
}
