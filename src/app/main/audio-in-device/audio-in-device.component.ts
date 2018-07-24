import { Component, OnInit, Input } from '@angular/core';
import { AudioInputDevice } from '../audio/audio';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AudioInDialogComponent } from '../audio-in-dialog/audio-in-dialog.component';

@Component({
  selector: 'app-audio-in-device',
  templateUrl: './audio-in-device.component.html',
  styleUrls: ['./audio-in-device.component.css']
})
export class AudioInDeviceComponent implements OnInit {
  @Input() audioDevice : AudioInputDevice;

  constructor(private popupDialog: MatDialog) { }

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
    }
    this.popupDialog.open(AudioInDialogComponent, dialogConfig);
  }
}
