import { Component, OnInit, Input } from '@angular/core';
import { DeviceSet } from './deviceset';

@Component({
  selector: 'app-deviceset',
  templateUrl: './deviceset.component.html',
  styleUrls: ['./deviceset.component.css']
})
export class DevicesetComponent implements OnInit {
  @Input() deviceSet : DeviceSet;

  constructor() { }

  ngOnInit() {
  }

  getLabel() : string {
    if (this.deviceSet.samplingDevice.tx === 0) {
      return "Rx" + this.deviceSet.samplingDevice.index;
    } else {
      return "Tx" + this.deviceSet.samplingDevice.index;
    }
  }

  getCenterFrequency() : number {
    if (this.deviceSet.samplingDevice) {
      return this.deviceSet.samplingDevice.centerFrequency;
    } else {
      return 0;
    }
  }
}
