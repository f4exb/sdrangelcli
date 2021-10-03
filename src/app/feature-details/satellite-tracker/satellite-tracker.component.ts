import { Time } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utils } from 'src/app/common-components/utils';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { FeatureSettings } from '../feature-details';
import { FeatureDetailsService } from '../feature-details.service';
import { SatelliteDeviceSettings, SatelliteTrackerSettings, SATELLITE_TRACKER_SETTINGS_MOCK } from './satellite-tracker';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { PresetService } from 'src/app/main/preset/preset.service';
import { PresetGet, Presets, PRESETS_DEFAULT } from 'src/app/main/preset/preset';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectPresetDialogComponent } from 'src/app/main/select-preset-dialog/select-preset-dialog.component';
import { DeviceSet } from 'src/app/deviceset/deviceset/deviceset';
import { DevicesetService } from 'src/app/deviceset/deviceset/deviceset.service';

export interface AzElUnits {
  value: number;
  viewValue: string;
}

export interface DeviceSetsSelect {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-satellite-tracker',
  templateUrl: './satellite-tracker.component.html',
  styleUrls: ['./satellite-tracker.component.css']
})
export class SatelliteTrackerComponent implements OnInit {
  @Output() featuresetChanged = new EventEmitter();
  featuresetIndex: number;
  featureIndex: number;
  sdrangelURL: string;
  settings: SatelliteTrackerSettings = SATELLITE_TRACKER_SETTINGS_MOCK;
  statusMessage: string;
  statusError = false;
  rgbTitle: number[] = [0, 0, 0];
  rgbTitleStr = 'rgb(0,0,0)';
  useReverseAPI: boolean;
  utc: boolean;
  drawOnMap: boolean;
  azElUnits: AzElUnits[] = [
    {value: 0, viewValue: 'DMS'},
    {value: 1, viewValue: 'DM'},
    {value: 2, viewValue: 'D'},
    {value: 3, viewValue: 'Decimal'}
  ];
  passStartTime: Time;
  passFinishTime: Time;
  sats: string[];
  satSelectable = true;
  satRemovable = true;
  satAddOnBlur = true;
  tles: string[];
  tleSelectable = true;
  tleRemovable = true;
  tleAddOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  ctlSat: string;
  presets: Presets = PRESETS_DEFAULT;
  devicesets: DeviceSet[] = [];
  devicesetsSelect: DeviceSetsSelect[] = [];
  dopplerChannelSelectable = true;
  dopplerChannelRemovable = true;
  dopplerChannelAddOnBlur = true;
  width: number;
  height: number;

  constructor(private route: ActivatedRoute,
    private featuredetailsService: FeatureDetailsService,
    private presetService: PresetService,
    private devicesetService: DevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    private popupDialog: MatDialog,
    private elementRef: ElementRef) {
      this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
      });
  }

  ngOnInit(): void {
    this.featuresetIndex = +this.route.snapshot.parent.params['dix'];
    this.featureIndex = +this.route.snapshot.parent.params['cix'];
    this.getFeatureSettings();
    this.fetchPresetInformation();
    this.fetchDeviceSetsInformation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.height = window.innerHeight;
     this.width = window.innerWidth;
  }

  private fetchPresetInformation() {
    this.presetService.getInfo(this.sdrangelURL).subscribe(
      presets => {
        this.presets = presets;
      },
      err => {
      }
    );
  }

  private fetchDeviceSetsInformation() {
    this.devicesetService.getDevicesets(this.sdrangelURL).subscribe(
      devicesets => {
        this.devicesets = devicesets.deviceSets;
        this.devicesets.forEach((deviceset, index) => {
          let displayStr = 'X';
          if (deviceset.samplingDevice.direction === 0) {
            displayStr = 'R' + index;
          } else if (deviceset.samplingDevice.direction === 1) {
            displayStr = 'T' + index;
          } else if (deviceset.samplingDevice.direction === 2) {
            displayStr = 'M' + index;
          }
          this.devicesetsSelect.push({
            value: index,
            viewValue: displayStr
          });
        });
      },
      err => {
      }
    );
  }

  getFeatureSettings() {
    this.featuredetailsService.getSettings(this.sdrangelURL, this.featuresetIndex, this.featureIndex).subscribe(
      featureSettings => {
        if (featureSettings.featureType === 'SatelliteTracker') {
          this.statusMessage = 'OK';
          this.statusError = false;
          this.settings = featureSettings.SatelliteTrackerSettings;
          this.rgbTitle = Utils.intToRGB(this.settings.rgbColor);
          this.rgbTitleStr = this.getRGBTitleStr();
          this.useReverseAPI = this.settings.useReverseAPI !== 0;
          this.utc = this.settings.utc !== 0;
          this.drawOnMap = this.settings.drawOnMap !== 0;
          this.sats = this.settings.satellites;
          this.tles = this.settings.tles;
        } else {
          this.statusMessage = 'Not an AIS feature';
          this.statusError = true;
        }
      }
    );
  }

  private setFeatureSettings(satelliteTrackerSettings: SatelliteTrackerSettings) {
    const settings: FeatureSettings = <FeatureSettings>{};
    settings.featureType = 'SatelliteTracker';
    settings.SatelliteTrackerSettings = satelliteTrackerSettings;
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

  getRGBTitleStr(): string {
    return 'rgb(' + this.rgbTitle[0].toString() + ',' + this.rgbTitle[1].toString() + ',' + this.rgbTitle[2].toString() + ')';
  }

  onTitleColorChanged(colorStr: string) {
    this.rgbTitleStr = colorStr;
    this.setTitleColor();
  }

  setLatitude() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.latitude = this.settings.latitude;
    this.setFeatureSettings(newSettings);
  }

  setLongitude() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.longitude = this.settings.longitude;
    this.setFeatureSettings(newSettings);
  }

  setASL() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.heightAboveSeaLevel = this.settings.heightAboveSeaLevel;
    this.setFeatureSettings(newSettings);
  }

  setDooplerPeriod() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.dopplerPeriod = this.settings.dopplerPeriod;
    this.setFeatureSettings(newSettings);
  }

  setUpdatePeriod() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.updatePeriod = this.settings.updatePeriod;
    this.setFeatureSettings(newSettings);
  }

  setMinAOSElevation() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.minAOSElevation = this.settings.minAOSElevation;
    this.setFeatureSettings(newSettings);
  }

  setMinPassElevation() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.minPassElevation = this.settings.minPassElevation;
    this.setFeatureSettings(newSettings);
  }

  setPasstartTime() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.passStartTime = this.settings.passStartTime;
    this.setFeatureSettings(newSettings);
  }

  setPassFinishTime() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.passFinishTime = this.settings.passFinishTime;
    this.setFeatureSettings(newSettings);
  }

  setRotatorMaxAzimuth() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.rotatorMaxAzimuth = this.settings.rotatorMaxAzimuth;
    this.setFeatureSettings(newSettings);
  }

  setRotatorMaxElevation() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.rotatorMaxElevation = this.settings.rotatorMaxElevation;
    this.setFeatureSettings(newSettings);
  }

  setAOSSpeech() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.aosSpeech = this.settings.aosSpeech;
    this.setFeatureSettings(newSettings);
  }

  setLOSSpeech() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.losSpeech = this.settings.losSpeech;
    this.setFeatureSettings(newSettings);
  }

  setAOSCommand() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.aosCommand = this.settings.aosCommand;
    this.setFeatureSettings(newSettings);
  }

  setLOSCommand() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.losCommand = this.settings.losCommand;
    this.setFeatureSettings(newSettings);
  }


  setDefaultFrequency() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.defaultFrequency = this.settings.defaultFrequency;
    this.setFeatureSettings(newSettings);
  }

  setAzElUnits() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.azElUnits = this.settings.azElUnits;
    this.setFeatureSettings(newSettings);
  }

  setGroundTrackPoints() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.groundTrackPoints = this.settings.groundTrackPoints;
    this.setFeatureSettings(newSettings);
  }

  setDateFormat() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.dateFormat = this.settings.dateFormat;
    this.setFeatureSettings(newSettings);
  }

  setDateTime() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.dateTime = this.settings.dateTime;
    this.setFeatureSettings(newSettings);
  }

  setUTC() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.utc = this.utc ? 1 : 0;
    this.setFeatureSettings(newSettings);
  }

  setDrawOnMap() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.drawOnMap = this.drawOnMap ? 1 : 0;
    this.setFeatureSettings(newSettings);
  }

  setTitleColor() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.rgbColor = Utils.rgbToInt(this.rgbTitleStr);
    this.setFeatureSettings(newSettings);
  }

  onTitleChanged(title: string) {
    this.settings.title = title;
    this.setTitle();
  }

  setTitle() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.title = this.settings.title;
    this.setFeatureSettings(newSettings);
  }

  setUseReverseAPI() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.useReverseAPI = this.useReverseAPI ? 1 : 0;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIAddress() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.reverseAPIAddress = this.settings.reverseAPIAddress;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIPort() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.reverseAPIPort = this.settings.reverseAPIPort;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIFeatureSetIndex() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.reverseAPIFeatureSetIndex = this.settings.reverseAPIFeatureSetIndex;
    this.setFeatureSettings(newSettings);
  }

  setReverseAPIFeatureIndex() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.reverseAPIFeatureIndex = this.settings.reverseAPIFeatureIndex;
    this.setFeatureSettings(newSettings);
  }

  addSat(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our sat
    if (value) {
      this.sats.push(value);
    }

    // Clear the input value
    // tslint:disable-next-line:no-non-null-assertion
    event.chipInput!.clear();

    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.satellites = this.sats;
    this.setFeatureSettings(newSettings);
  }

  removeSat(sat: string): void {
    const index = this.sats.indexOf(sat);

    if (index >= 0) {
      this.sats.splice(index, 1);
      const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
      newSettings.satellites = this.sats;
      this.setFeatureSettings(newSettings);
    }
  }

  addTLE(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tle
    if (value) {
      this.tles.push(value);
    }

    // Clear the input value
    // tslint:disable-next-line:no-non-null-assertion
    event.chipInput!.clear();

    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.tles = this.tles;
    this.setFeatureSettings(newSettings);
  }

  removeTLE(tle: string): void {
    const index = this.tles.indexOf(tle);

    if (index >= 0) {
      this.tles.splice(index, 1);
      const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
      newSettings.tles = this.tles;
      this.setFeatureSettings(newSettings);
    }
  }

  setDeviceSettings() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.deviceSettings = this.settings.deviceSettings;
    this.setFeatureSettings(newSettings);
  }

  setCtlSat() {
  }

  addSatControl() {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};

    if (this.settings.deviceSettings === undefined) {
      newSettings.deviceSettings = [];
    } else {
      newSettings.deviceSettings = this.settings.deviceSettings;
    }

    let prGroup = '';
    let prDesc = '';
    let prFreq = 0;

    for (const presetGroup of this.presets.groups) {
      for (const preset of presetGroup.presets) {
        if (preset.type === 'R') {
          prGroup = presetGroup.groupName;
          prDesc = preset.name;
          prFreq = preset.centerFrequency;
          break;
        }
      }
    }

    newSettings.deviceSettings.push({
      satellite: this.ctlSat,
      deviceSettings: [
        {
          deviceSetIndex: 0,
          frequency: 0,
          presetGroup: prGroup,
          presetDescription: prDesc,
          presetFrequency: prFreq,
          startOnAOS: 0,
          startStopFileSinks: 0,
          stopOnLOS: 0,
          aosCommand: '',
          losCommand: ''
        }
      ]
    });
    this.setFeatureSettings(newSettings);
  }

  openSelectPresetDialog(satIndex: number, deviceIndex: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.presets;
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    const buttonElement = <HTMLButtonElement>document.getElementById(this.getPresetSelectButtonId(satIndex, deviceIndex));
    let dialogY = buttonElement.getBoundingClientRect().y;
    const dialogX = buttonElement.getBoundingClientRect().x + 10;
    if (dialogY + 180 > this.height) {
      dialogY -= dialogY + 180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(SelectPresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
        newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));
        newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].presetGroup = (<PresetGet>result).groupName;
        newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].presetDescription = (<PresetGet>result).name;
        newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].presetFrequency = (<PresetGet>result).centerFrequency;
        this.setFeatureSettings(newSettings);
        this.featuresetChanged.emit(); // triggers refresh
      }
    });
  }

  devCtlRemoveSat(satIndex: number) {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));
    newSettings.deviceSettings.splice(satIndex, 1);
    this.setFeatureSettings(newSettings);
    this.featuresetChanged.emit(); // triggers refresh
  }

  devCtlAddDeviceset(satIndex: number) {
    let prGroup = '';
    let prDesc = '';
    let prFreq = 0;

    for (const presetGroup of this.presets.groups) {
      for (const preset of presetGroup.presets) {
        if (preset.type === 'R') {
          prGroup = presetGroup.groupName;
          prDesc = preset.name;
          prFreq = preset.centerFrequency;
          break;
        }
      }
    }

    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));
    newSettings.deviceSettings[satIndex].deviceSettings.push({
      deviceSetIndex: 0,
      frequency: 0,
      presetGroup: prGroup,
      presetDescription: prDesc,
      presetFrequency: prFreq,
      startOnAOS: 0,
      startStopFileSinks: 0,
      stopOnLOS: 0,
      aosCommand: '',
      losCommand: ''
    });
    this.setFeatureSettings(newSettings);
    this.featuresetChanged.emit(); // triggers refresh
  }

  devCtlRemoveDevice(satIndex: number, deviceIndex: number) {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));
    newSettings.deviceSettings[satIndex].deviceSettings.splice(deviceIndex, 1);
    this.setFeatureSettings(newSettings);
    this.featuresetChanged.emit(); // triggers refresh
  }

  devCtlSetDevice(satIndex: number, deviceIndex: number) {
    const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
    newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));
    this.setFeatureSettings(newSettings);
    this.featuresetChanged.emit(); // triggers refresh
  }

  removeDopplerChannel(satIndex: number, deviceIndex: number, channelIndexStr: string) {
    if ((this.settings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler !== undefined) &&
    (channelIndexStr in this.settings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler)) {
      const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
      newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));
      const index = newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler.indexOf(channelIndexStr, 0);
      newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler.splice(index, 1);
      this.setFeatureSettings(newSettings);
      this.featuresetChanged.emit(); // triggers refresh
    }
  }

  addDopplerChannel(satIndex: number, deviceIndex: number, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our channel
    if (value) {
      console.log(satIndex, deviceIndex, value);

      if (!isNaN(+value)) {
        const newSettings: SatelliteTrackerSettings = <SatelliteTrackerSettings>{};
        newSettings.deviceSettings = this.settings.deviceSettings.map(x => Object.assign(x));

        if (newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler === undefined) {
          newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler = [];
        }

        newSettings.deviceSettings[satIndex].deviceSettings[deviceIndex].doppler.push(value);
        this.setFeatureSettings(newSettings);
        this.featuresetChanged.emit(); // triggers refresh
      }
    }

    // Clear the input value
    // tslint:disable-next-line:no-non-null-assertion
    event.chipInput!.clear();
  }

  getPresetSelectButtonId(satIndex: number, deviceIndex: number) {
    return 'btn-select-preset-${satIndex}-${deviceIndex}';
  }
}
