import { Component, OnInit, Input } from '@angular/core';
import { AudioOutputDevice } from '../audio/audio';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AudioOutDialogComponent } from '../audio-out-dialog/audio-out-dialog.component';

@Component({
  selector: 'app-audio-out-device',
  templateUrl: './audio-out-device.component.html',
  styleUrls: ['./audio-out-device.component.css']
})
export class AudioOutDeviceComponent implements OnInit {
  @Input() audioDevice: AudioOutputDevice;

  constructor(private popupDialog: MatDialog) { }

  ngOnInit() {
  }

  isSystemDefault(): boolean {
    if (this.audioDevice.isSystemDefault) {
      return this.audioDevice.isSystemDefault !== 0;
    } else {
      return false;
    }
  }

  isEdited(): boolean {
    if (this.audioDevice.defaultUnregistered === 0) {
      return true;
    } else {
      return false;
    }
  }

  getChannelMode(): string {
    switch (this.audioDevice.udpChannelMode) {
      case 0:
        return 'left';
      case 1:
        return 'right';
      case 2:
        return 'mixed';
      case 3:
        return 'stereo';
      default:
        return 'none';
    }
  }

  copyToUDP(): boolean {
    if (this.audioDevice.copyToUDP === 0) {
      return false;
    } else {
      return true;
    }
  }

  useRTP(): boolean {
    if (this.audioDevice.udpUsesRTP === 0) {
      return false;
    } else {
      return true;
    }
  }

  openDeviceDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      audioDevice: this.audioDevice
    };
    dialogConfig.height = '35%';
    dialogConfig.width = '30%';
    dialogConfig.position = {
      top: '0',
      left: '35%'
    };
    this.popupDialog.open(AudioOutDialogComponent, dialogConfig);
  }
}
