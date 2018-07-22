import { Component, OnInit, Input } from '@angular/core';
import { AudioOutputDevice } from '../audio/audio';

@Component({
  selector: 'app-audio-out-device',
  templateUrl: './audio-out-device.component.html',
  styleUrls: ['./audio-out-device.component.css']
})
export class AudioOutDeviceComponent implements OnInit {
  @Input() audioDevice : AudioOutputDevice;

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

  getChannelMode() : string {
    switch(this.audioDevice.udpChannelMode)
    {
      case 0:
        return "left";
      case 1:
        return "right";
      case 2:
        return "mixed";
      case 3:
        return "stereo";
      default:
        return "none";
    }
  }

  copyToUDP() : boolean {
    if (this.audioDevice.copyToUDP === 0) {
      return false;
    } else {
      return true;
    }
  }

  useRTP() : boolean {
    if (this.audioDevice.udpUsesRTP === 0) {
      return false;
    } else {
      return true;
    }
  }
}
