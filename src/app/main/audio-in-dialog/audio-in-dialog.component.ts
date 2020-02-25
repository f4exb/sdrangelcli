import { Component, OnInit, Inject } from '@angular/core';
import { AudioInputDevice } from '../audio/audio';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AudioService } from '../audio/audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-audio-in-dialog',
  templateUrl: './audio-in-dialog.component.html',
  styleUrls: ['./audio-in-dialog.component.css']
})
export class AudioInDialogComponent implements OnInit {
  sdrangelURL: string;
  audioDevice: AudioInputDevice;
  audioDeviceRef: AudioInputDevice;

  constructor(private dialogRef: MatDialogRef<AudioInDialogComponent>,
    private audioService: AudioService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.audioDevice = data.audioDevice;
      this.audioDevice.volume = Number(this.audioDevice.volume.toFixed(2));
      this.audioDeviceRef = <AudioInputDevice> {};
      this.audioDeviceCopy(this.audioDevice, this.audioDeviceRef); // store reference state with custom copy
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close();
    this.audioDeviceCopy(this.audioDeviceRef, this.audioDevice); // restore reference state with custom copy
  }

  save() {
    this.audioService.updateAudioInput(this.sdrangelURL + '/audio/output/parameters', this.audioDevice).subscribe(
      res => {
        console.log('Update OK', res);
        this.dialogRef.close();
        this.audioDeviceCopy(this.audioDevice, this.audioDeviceRef); // update reference state with custom copy
      },
      err => {
        this.snackBar.open(err.error.message, 'OK', {duration: 2000});
        this.dialogRef.close();
        this.audioDeviceCopy(this.audioDeviceRef, this.audioDevice); // restore reference state with custom copy
      }
    );
  }

  private audioDeviceCopy(from: AudioInputDevice, to: AudioInputDevice) {
    to.sampleRate = from.sampleRate;
    to.volume = from.volume;
    to.defaultUnregistered = from.defaultUnregistered;
  }
}
