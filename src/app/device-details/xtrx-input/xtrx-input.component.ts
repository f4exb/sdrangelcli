import { Component, OnInit } from '@angular/core';
import { FrequencyStep, FREQUENCY_STEP_DEVICE_DEFAULTS } from 'src/app/common-components/frequency-dial/frequency-dial.component';
import { XTRXInputSettings, XTRX_INPUT_SETTINGS_DEFAULT } from './xtrx-input';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetailsService } from '../device-details.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { DeviceSettings } from '../device-details';
import { DeviceStoreService, DeviceStorage } from '../../device-store.service';

export interface Log2Decim {
  value: number;
  viewValue: number;
}

export interface GainMode {
  value: number;
  viewValue: string;
}

export interface Antenna {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-xtrx-input',
  templateUrl: './xtrx-input.component.html',
  styleUrls: ['./xtrx-input.component.css']
})
export class XtrxInputComponent implements OnInit {
  statusMessage: string;
  statusError = false;
  log2Decims: Log2Decim[] = [
    {value: 0, viewValue: 1},
    {value: 1, viewValue: 2},
    {value: 2, viewValue: 4},
    {value: 3, viewValue: 8},
    {value: 4, viewValue: 16},
    {value: 5, viewValue: 32},
    {value: 6, viewValue: 64},
  ];
  gainModes: GainMode[] = [
    {value: 0, viewValue: 'Auto'},
    {value: 1, viewValue: 'Manual'},
  ];
  Antennas: Antenna[] = [
    {value: 0, viewValue: 'Low'},
    {value: 1, viewValue: 'High'},
    {value: 2, viewValue: 'Wide'},
  ];
  frequencySteps: FrequencyStep[] = FREQUENCY_STEP_DEVICE_DEFAULTS;
  deviceIndex: number;
  sdrangelURL: string;
  settings: XTRXInputSettings = XTRX_INPUT_SETTINGS_DEFAULT;
  centerFreqKhz: number;
  rfBandwidthKhz: number;
  dcBlock: boolean;
  iqCorrection: boolean;
  transverter: boolean;
  ncoEnable: boolean;
  extClock: boolean;
  useReverseAPI: boolean;

  constructor(private route: ActivatedRoute,
    private devicedetailsService: DeviceDetailsService,
    private sdrangelUrlService: SdrangelUrlService,
    private deviceStoreService: DeviceStoreService) {
  }

  ngOnInit() {
  }

}
