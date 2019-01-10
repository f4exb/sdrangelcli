import { Component, OnInit, Inject } from '@angular/core';
import { AudioOutputDevice } from '../audio/audio';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AudioService } from '../audio/audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

export interface ChannelMode {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-audio-out-dialog',
  templateUrl: './audio-out-dialog.component.html',
  styleUrls: ['./audio-out-dialog.component.css']
})
export class AudioOutDialogComponent implements OnInit {
  channelModes: ChannelMode[] = [
    {value: 0, viewValue: 'Left'},
    {value: 1, viewValue: 'Right'},
    {value: 2, viewValue: 'Mixed'},
    {value: 3, viewValue: 'Stereo'}
  ];
  sdrangelURL: string;
  audioDevice: AudioOutputDevice;
  audioDeviceRef: AudioOutputDevice;
  copyToUDP: boolean;
  udpUsesRTP: boolean;

  constructor(private dialogRef: MatDialogRef<AudioOutDialogComponent>,
    private audioService: AudioService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
    this.audioDevice = data.audioDevice;
    this.audioDeviceRef = <AudioOutputDevice> {};
    this.audioDeviceCopy(this.audioDevice, this.audioDeviceRef); // store reference
    this.copyToUDP = this.audioDevice.copyToUDP !== 0;
    this.udpUsesRTP = this.audioDevice.udpUsesRTP !== 0;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  setCopyToUDP() {
    this.audioDevice.copyToUDP = this.copyToUDP ? 1 : 0;
  }

  setUDPUsesRTP() {
    this.audioDevice.udpUsesRTP = this.udpUsesRTP ? 1 : 0;
  }

  close() {
    this.dialogRef.close();
    this.audioDeviceCopy(this.audioDeviceRef, this.audioDevice); // restore from reference
  }

  save() {
    this.audioService.updateAudioOutput(this.sdrangelURL + '/audio/output/parameters', this.audioDevice).subscribe(
      res => {
        console.log('Update OK', res);
        this.dialogRef.close();
        this.audioDeviceCopy(this.audioDevice, this.audioDeviceRef); // update reference
      },
      err => {
        this.snackBar.open(err.error.message, 'OK', {duration: 2000});
        this.dialogRef.close();
        this.audioDeviceCopy(this.audioDeviceRef, this.audioDevice); // restore from reference
      }
    );
  }

  private audioDeviceCopy(from: AudioOutputDevice, to: AudioOutputDevice) {
    to.sampleRate = from.sampleRate;
    to.copyToUDP = from.copyToUDP;
    to.udpUsesRTP = from.udpUsesRTP;
    to.udpAddress = from.udpAddress;
    to.udpChannelMode = from.udpChannelMode;
    to.udpPort = from.udpPort;
    to.defaultUnregistered = from.defaultUnregistered;
  }
}
