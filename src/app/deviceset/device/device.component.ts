import { Component, OnInit, Input } from '@angular/core';
import { Device } from './device';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  @Input() device : Device;

  constructor() { }

  ngOnInit() {
  }

  hasSerial() : boolean {
    if (this.device && this.device.serial) {
      return true;
    } else {
      return false;
    }
  }

  getSerial() : string {
    if (this.device && this.device.serial) {
      return "["+ String(this.device.sequence) + ":" + String(this.device.streamIndex) + "] " + this.device.serial;
    } else {
      return "";
    }
  }
}
