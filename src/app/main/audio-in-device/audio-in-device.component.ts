import { Component, OnInit, Input } from '@angular/core';
import { AudioInputDevice } from '../audio/audio';

@Component({
  selector: 'app-audio-in-device',
  templateUrl: './audio-in-device.component.html',
  styleUrls: ['./audio-in-device.component.css']
})
export class AudioInDeviceComponent implements OnInit {
  @Input() audioDevice : AudioInputDevice;

  constructor() { }

  ngOnInit() {
  }

  isSystemDefault() : boolean {
    if (this.audioDevice.isSystemDefault) {
      return this.audioDevice.isSystemDefault !== 0;
    } else {
      return false;
    }
  }

  isEdited() : boolean {
    if (this.audioDevice.defaultUnregistered === 0) {
      return true;
    } else {
      return false;
    }
  }
}
